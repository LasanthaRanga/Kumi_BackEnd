var express = require('express');
var router = express.Router();
const tree = require('../controllers/networkTree/tree');
const commition = require('../controllers/networkTree/commition');
const checkAuth = require('../middleware/check-auth');

// tree
router.post("/getFullTree", tree.getFullTree);
router.post("/addToTree", tree.addToTree);
router.post("/canAdd", tree.canAdd);
router.post("/addPoint", tree.addPoint);
router.post("/getDownTree", tree.getDownTree);
router.post("/newNode", tree.newNode);
router.post("/getCurrent", tree.getCurrent);
router.post("/getIntroduser", tree.getIntroduser);
router.post("/updateIntroduser", tree.updateIntroduser);
router.post("/getCurrentPoint", tree.getCurrentPoint);
router.post("/getFreePins", tree.getFreePins);
router.post("/getNotActive", tree.getNotActive);
router.post("/activeNode", tree.activeNode);
router.post("/getDownTreeLimited", tree.getDownTreeLimited);
router.post("/newPlacement", tree.newPlacement);


// commition
router.post("/balancePoint", commition.balancePoint);
router.post("/process", commition.process);
router.post("/getProcess", commition.getProcess);
router.post("/getPointCommitonList", commition.getPointCommitonList);
router.post("/getIntroCommitonList", commition.getIntroCommitonList);
router.post("/getPointCommitonByUser", commition.getPointCommitonByUser);
router.post("/getIntroCommitonByUser", commition.getIntroCommitonByUser);
router.post("/getPointCommitonByUserDates", commition.getPointCommitonByUserDates);
router.post("/getIntroCommitonByUserDates", commition.getIntroCommitonByUserDates);

module.exports = router;