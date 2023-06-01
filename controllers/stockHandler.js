const axios = require("axios");

const getStockPrice = async stockName => {
  //check for valid stockName
  if (stockName === "") throw "Stock symbol cannot be empty";
  const url = `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stockName}/quote`;

  try {
    //call external api
    const response = await axios.get(url);
    //get data from api
    const stockData = await response.data;
    //check for valid response
    if (stockData === undefined)
      throw "Unknown symbol"
    //console.log(stockData["latestPrice"]);
    return (stockData["latestPrice"]);
  } catch (error) {
    throw error;
  }
};

module.exports = getStockPrice;