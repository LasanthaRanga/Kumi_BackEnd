const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const mycon = require('../util/conn');
var fs = require('fs');
var dateFormat = require('dateformat');
let path = '';
const multer = require('multer');
var appRoot = require('app-root-path');

// const uppath = "./uploads";

const uppath = "../public_html/uploads";
// const downpath = "https://www.coopshop.lk/uploads/profile/";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uppath);
    },
    filename: function (req, file, cb) {
        let date = dateFormat(new Date(), 'yyyyMMddHHmmss_', 'en-US', '+0530');
        path = date + file.originalname;
        cb(null, path);
    }
}
);

const upload = multer(
    { storage: storage }
);

router.post("/upload", upload.single('attach'), (req, res, next) => {
    try {
        console.log(req.file.path + "  --> Path ");
        let pp = path;
        mycon.execute("INSERT INTO `image` ( `image_path`, `image_status`, `adv_idadv` ) " +
            " VALUES 	(  '" + pp + "', 0, '" + req.body.idAdv + "' )", (error, rows, next) => {
                if (!error) {
                    res.send({ imgpath: pp });
                } else {
                    console.log(error);
                }
            });
    } catch (error) {
        console.log("-----")
        console.log(error);
    }
});

router.get('/getUploadList/:id', (req, res, nex) => {
    console.log(req.params);
    try {
        mycon.execute("SELECT image.idimage,image.image_path,image.image_status,image.adv_idadv FROM image WHERE image.adv_idadv=" + req.params.id, (error, rows, next) => {
            if (!error) {
                res.send(rows);
            } else {
                console.log(error);
            }
        });
    } catch (error) {
        console.log(error);
    }
});


router.get('/:path', (req, res, nex) => {
    //    console.log("hit");
    var path = req.params.path;
    //  console.log(appRoot);
    res.sendFile(appRoot + '/uploads/' + path);
});



module.exports = router;