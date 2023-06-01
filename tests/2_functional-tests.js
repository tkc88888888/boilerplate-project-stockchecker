const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  //Viewing one stock: GET request to /api/stock-prices/
  //{"stockData":{"stock":"MSFT","price":332.28,"likes":801}}
  test('Viewing one stock', function(done) {
    chai.request(server)
      .get('/api/stock-prices/')
      .query({
        stock: "msft",
        like: false
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, "stockData");
        assert.isObject(res.body.stockData);
        assert.property(res.body.stockData, "stock");
        assert.property(res.body.stockData, "price");
        assert.property(res.body.stockData, "likes");
        //let likenum = res.body.stockData.likes;
        done();
      });
  }).timeout(3000);
  //Viewing one stock and liking it: GET request to /api/stock-prices/
  //{"stockData":{"stock":"MSFT","price":332.28,"likes":801}}
  test('Viewing one stock and liking it', function(done) {
    chai.request(server)
      .get('/api/stock-prices/')
      .query({
        stock: "msft",
        like: true
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, "stockData");
        assert.isObject(res.body.stockData);
        assert.property(res.body.stockData, "stock");
        assert.property(res.body.stockData, "price");
        assert.property(res.body.stockData, "likes");
        //assert.equal(res.body.stockData.likes, likenum + 1);
        done();
      });
  }).timeout(3000);
  //Viewing the same stock and liking it again: GET request to /api/stock-prices/
  test('Viewing one stock and liking it again', function(done) {
    chai.request(server)
      .get('/api/stock-prices/')
      .query({
        stock: "msft",
        like: true
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, "stockData");
        assert.isObject(res.body.stockData);
        assert.property(res.body.stockData, "stock");
        assert.property(res.body.stockData, "price");
        assert.property(res.body.stockData, "likes");
        //assert.equal(res.body.stockData.likes, likenum + 1);
        done();
      });
  }).timeout(3000);
  //Viewing two stocks: GET request to /api/stock-prices/
  //{"stockData":[{"stock":"MSFT","price":62.30,"rel_likes":-1},{"stock":"GOOG","price":786.90,"rel_likes":1}]}
  test('Viewing two stock', function(done) {
    chai.request(server)
      .get('/api/stock-prices/')
      .query({
        stock: ['GOOG', 'MSFT'],
        like: false
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, "stockData");
        assert.isArray(res.body.stockData);
        assert.isObject(res.body.stockData[0]);
        assert.property(res.body.stockData[0], "stock");
        assert.property(res.body.stockData[0], "price");
        assert.property(res.body.stockData[0], "rel_likes");
        assert.isObject(res.body.stockData[1]);
        assert.property(res.body.stockData[1], "stock");
        assert.property(res.body.stockData[1], "price");
        assert.property(res.body.stockData[1], "rel_likes");
        //assert.equal(res.body.stockData.likes, likenum + 1);
        done();
      });
  }).timeout(3000);
  //Viewing two stocks and liking them: GET request to /api/stock-prices/
  test('Viewing two stock and liking them', function(done) {
    chai.request(server)
      .get('/api/stock-prices/')
      .query({
        stock: ['GOOG', 'MSFT'],
        like: true
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, "stockData");
        assert.isArray(res.body.stockData);
        assert.isObject(res.body.stockData[0]);
        assert.property(res.body.stockData[0], "stock");
        assert.property(res.body.stockData[0], "price");
        assert.property(res.body.stockData[0], "rel_likes");
        assert.isObject(res.body.stockData[1]);
        assert.property(res.body.stockData[1], "stock");
        assert.property(res.body.stockData[1], "price");
        assert.property(res.body.stockData[1], "rel_likes");
        //assert.equal(res.body.stockData.likes, likenum + 1);
        done();
      });
  }).timeout(3000);
});
