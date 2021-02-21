var express = require('express');
var router = express.Router();
const prod = require('../controllers/product/poduct');

const checkAuth = require('../middleware/check-auth');

//user
router.post("/getAllProduct", prod.getAllProduct);




module.exports = router;