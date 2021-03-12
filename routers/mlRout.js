var express = require('express');
var router = express.Router();
const mltree = require('../controllers/networkTree/mltree');
const commition = require('../controllers/networkTree/commition');
const checkAuth = require('../middleware/check-auth');

router.post("/register", mltree.register);
router.post("/getTree", mltree.getTree);
router.post("/getIncomeByUser", mltree.getIncomeByUser);
router.post("/getIncomeAllUsers", mltree.getIncomeAllUsers);
router.post("/findRef", mltree.findRef);
router.post("/getTreeIdByUser", mltree.getTreeIdByUser);















module.exports = router;