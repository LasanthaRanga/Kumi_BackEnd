var express = require('express');
var router = express.Router();
const user = require('../controllers/userControllers/user');
const userType = require('../controllers/userControllers/usetType');
const privilage = require('../controllers/userControllers/privilege');
const checkAuth = require('../middleware/check-auth');

//user
router.post("/getAllUsers", user.getAllUsers);
router.post("/getUsersList", user.getUsersList);
router.post("/update", user.update);
router.post("/signUp", user.signUp);
router.post("/userLogin", user.userLogin);
router.post("/getUserKeys", user.getUserKeys);
router.post("/saveNewUser", user.saveNewUser);
router.post("/getAllUsers", user.getAllUsers);
router.post("/searchUserById", user.searchUserById);
router.post("/sendLoginInformation", user.sendLoginInformation);
router.post("/createPassword", user.createPassword);
router.post("/getUserData", user.getUserData);

//userType
router.post("/getAllUserType", userType.getAllUserType);


//privilage
router.post("/getPrivilagesByUserType", privilage.getPrivilagesByUserType);

//Sms
router.post("/singalMessage", user.singalMessage);


//online registration
router.post("/onreg", user.checkForEmptyPinAndRegister);


//KUMI

router.post("/getDistric", user.getDistric);
router.post("/getCitys", user.getCitys);



module.exports = router;