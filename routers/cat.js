var express = require('express');
var router = express.Router();
const catController = require('../controllers/category/catController');

/* GET users listing. */



router.post("/getAll", catController.getAll);
router.post("/getAllByMain", catController.getAllByMain);
router.post("/addCat", catController.addCat);
router.post("/getAllSubCats", catController.getAllSubCats);
router.post("/getAddsByCats", catController.getAddsByCats);
router.post("/getAddsByCatsAndDis", catController.getAddsByCatsAndDis);
router.post("/getAddsByCatsAndCity", catController.getAddsByCatsAndCity);
router.post("/getMainCats", catController.getMainCats);
router.post("/saveCity", catController.saveCity);




module.exports = router;