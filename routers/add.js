var express = require('express');
var router = express.Router();
const addController = require('../controllers/add/addController');

/* GET users listing. */



router.post("/getAll", addController.getAllUsers);
router.post("/newPost", addController.newPost);
router.post("/getPending", addController.getPending);
router.post("/getAddData", addController.getAddData);
router.post("/setActiveAdv", addController.setActiveAdv);
router.post("/getActive", addController.getActive);
router.post("/getActiveByDistict", addController.getActiveByDistict);
router.post("/getHomeAdd", addController.getHomeAdd);
router.post("/getSiteAdd", addController.getSiteAdd);
// router.post("/getSiteAdd", addController.getSiteAdd);
//commnet line

module.exports = router;