'use strict';
var expect = require('chai').expect;
let mongodb = require('mongodb');
let mongoose = require('mongoose');
var connectDB = require("../db/mongoose");
var getStockPrice = require("../controllers/stockHandler");
const crypto = require('crypto');

module.exports = function(app) {
  connectDB(async s => {
    ///api/stock-prices?stock=GOOG&stock=MSFT&like=true
    app.route('/api/stock-prices')
      .get(async (req, res) => {
        let { stock, like } = req.query;
        let ip = like? hashIP(req.ip) : hashIP("0");
        console.log("req.ip");
        console.log(req.ip);        
        if (!Array.isArray(stock)){
          let price = await getStockPrice(stock);
          let stockandprice = await updatestockDB(s,stock, price, ip);
          let likes = await findstocklikesDB(s,stock);
          console.log("likes");
          console.log(likes);
          let stockData = {...stockandprice,likes};
          console.log("stockData");
          console.log(stockData);
          //{"stockData":{"stock":"MSFT","price":332.28,"likes":801}}
          return res.json({ stockData })
        } else {
          let stocksandprices = stock.map(async onestock => {
            let oneprice = await getStockPrice(onestock);
            let stockandprice = await updatestockDB(s,onestock, oneprice, ip);
            return stockandprice;
          });
          stocksandprices = await Promise.all(stocksandprices);
          console.log("stocksandprices");
          console.log(stocksandprices);
          let likes = stock.map(async onestock => {
            let onelike = await findstocklikesDB(s,onestock);
            return onelike;
          });
          likes = await Promise.all(likes);
          let stockData = [];
          stockData.push({...stocksandprices[0],  rel_likes: likes[0] - likes[1]});
          stockData.push({...stocksandprices[1],  rel_likes: likes[1] - likes[0]});
          console.log("stockData");
          console.log(stockData);
          //{"stockData":[{"stock":"MSFT","price":62.30,"rel_likes":-1},{"stock":"GOOG","price":786.90,"rel_likes":1}]}
          return res.json({ stockData })
        };
      });
  });
};

function hashIP(ipAddress) {
  const hash = crypto.createHash('sha256');
  hash.update(ipAddress);
  return hash.digest('hex');
}

async function findstocklikesDB(s,stock) {
  try {
    let result = await s.findOne({ stock: stock });
    //console.log("likedby length")
    //console.log(result["likedby"].filter(e => e !== 0).length)
    return(result["likedby"].filter(e => e !== hashIP("0")).length);
  } catch (error) {
    throw error;
  }
};
  //console.log(likedby);
//let likes = (like && !likedby.includes(req.ip)) ? likedby.push(req.ip) : likedby.length;

 async function updatestockDB(s,stock, price, ip) { 
  try {
    console.log("ip");
    console.log(ip);
    let updatedStock = await s.findOneAndUpdate(
      { stock }, // Filter condition
      { price, $addToSet: {likedby:ip}},   // Update fields
      { new: true, upsert: true }
    );
    return ({stock, price});
  } catch (error) {
    throw error;
  }
};
