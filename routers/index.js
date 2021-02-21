var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  var param = { OK: "Responce is Ok", code: "0000" };
  res.send(param);
});

// testing comit

module.exports = router;
