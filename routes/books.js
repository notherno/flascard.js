var express = require('express');
var router = express.Router();

router.get('/books/', function(req, res, next) {
  res.send('respond with a resource');
  console.log(req);
});

module.exports = router;
