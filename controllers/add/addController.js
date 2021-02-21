const mycon = require('../../util/conn');
const jwt = require('jsonwebtoken');
var dateFormat = require('dateformat');



exports.rES = (str) => {
    str = str + "";
    return str.toString().replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
        switch (char) {
            case "\0":
                return "\\0";
            case "\x08":
                return "\\b";
            case "\x09":
                return "\\t";
            case "\x1a":
                return "\\z";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "\"":
            case "'":
            case "\\":
            case "%":
                return "\\" + char; // prepends a backslash to backslash, percent,
            // and double/single quotes
        }
    });
}

exports.getHomeAdd = (req, res, next) => {
    try {
        var day = dateFormat(new Date(), "yyyy-mm-dd");
        mycon.execute("SELECT adv.idadv,adv.city_idcity,adv.distric_iddistric,adv.cat_idcat,adv.deler,adv.adv_start_date,adv.adv_end_date,adv.adv_status,adv.adv_priority,adv.iduser,adv.site,image.image_path FROM adv INNER JOIN image ON image.adv_idadv=adv.idadv " +
            "WHERE adv.cat_idcat IN (" + req.body.catids + ") AND adv.adv_priority= " + req.body.priority + " AND adv.site='" + req.body.site + "' AND adv.adv_end_date > '" + day + "' GROUP BY adv.idadv ORDER BY adv.idadv DESC LIMIT " + req.body.limit + "", (e, r, f) => {
                if (!e) {
                    res.send(r);
                }
            })
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

exports.getSiteAdd = (req, res, next) => {
    try {
        var day = dateFormat(new Date(), "yyyy-mm-dd");
        mycon.execute(" SELECT adv.idadv,adv.city_idcity,adv.distric_iddistric,adv.cat_idcat,adv.deler,adv.adv_start_date,adv.adv_end_date,adv.adv_status,adv.adv_priority,adv.iduser,adv.site,image.image_path,cat.`name`,cat.sinhala FROM adv INNER JOIN image ON image.adv_idadv=adv.idadv INNER JOIN cat ON cat.id=adv.cat_idcat  " +
            " WHERE  adv.adv_priority= '" + req.body.priority + "' AND adv.site='" + req.body.site + "' AND adv.adv_end_date >= '" + day + "' GROUP BY adv.idadv ORDER BY adv.idadv DESC LIMIT  " + req.body.limit + "", (e, r, f) => {
                if (!e) {
                    res.send(r);
                } else {
                    console.log(e);
                }
            })
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}




exports.getAllUsers = (req, res, next) => {
    try {
        mycon.execute("select * from user",
            (error, rows, fildData) => {
                if (!error) {
                    res.send(rows);
                }
            });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

exports.newPost = (req, res, next) => {
    var day = dateFormat(new Date(), "yyyy-mm-dd");
    try {
        mycon.execute("INSERT INTO `adv` ( `city_idcity`, `distric_iddistric`, `cat_idcat`, `deler`, `adv_start_date`, `adv_end_date`, `adv_status`, `adv_priority`, `site`) " +
            " VALUES 	(  '" + this.rES(req.body.city) + "', '" + this.rES(req.body.distric) + "', '" + this.rES(req.body.lastSelected) + "', '" + this.rES(req.body.user) + "', '" + day + "', NULL, 0, NULL,'" + req.body.site + "' )",
            (error, rows, fildData) => {
                if (!error) {
                    let id = rows.insertId;
                    mycon.execute("INSERT INTO `details` (`company_name`,`owner_name`,`address1`,`address2`,`address3`,`description`, " +
                        " `company_name_sinhala`,`owner_name_sihala`,`description_sinhala`,`con_phone`,`con_mobile`,`con_imo`,`con_viber`, " +
                        "  `con_whatsapp`,`con_fb`,`con_web`,`con_youtube`,`details_other`,`adv_idadv`) " +
                        "  VALUES ('" + this.rES(req.body.company) + "','" + this.rES(req.body.owner) + "','" + this.rES(req.body.adl1) + "','" + this.rES(req.body.adl2) + "','" + this.rES(req.body.adl3) + "', " +
                        "  '" + this.rES(req.body.des) + "','" + this.rES(req.body.companyS) + "','" + this.rES(req.body.ownerS) + "', " +
                        "  '" + this.rES(req.body.desS) + "','" + this.rES(req.body.phone) + "','" + this.rES(req.body.mobile) + "','" + this.rES(req.body.imo) + "','" + this.rES(req.body.viber) + "','" + this.rES(req.body.price) + "','" + this.rES(req.body.fb) + "','" + this.rES(req.body.web) + "','" + this.rES(req.body.yt) + "',NULL,'" + id + "')",
                        (er, ro, fd) => {
                            if (!er) {
                                res.send({ 'idAdv': id });
                            } else {
                                console.log(er);
                                res.status(500).send(er);
                            }
                        });
                } else {
                    console.log(error);
                    res.status(500).send(error);
                }
            });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

exports.getPending = (req, res, next) => {
    try {
        mycon.execute("SELECT adv.idadv,adv.city_idcity,adv.distric_iddistric,adv.cat_idcat,adv.deler,adv.adv_start_date, " +
            "   adv.adv_end_date,adv.adv_status,adv.adv_priority,details.iddetails,details.company_name,details.owner_name," +
            "   details.address1,details.address2,details.address3,details.description,details.company_name_sinhala," +
            "   details.owner_name_sihala,details.description_sinhala,details.con_phone,details.con_mobile,details.con_imo," +
            "   details.con_viber,details.con_whatsapp,details.con_fb,details.con_web,details.con_youtube,details.details_other," +
            "   details.adv_idadv,image.idimage,image.image_path,image.image_status FROM adv " +
            "   INNER JOIN details ON details.adv_idadv=adv.idadv INNER JOIN image ON image.adv_idadv=adv.idadv " +
            "   WHERE adv.adv_status=0 GROUP BY adv.idadv", (error, rows, fildData) => {
                if (!error) {
                    res.send(rows);
                } else {
                    console.log(error);
                    res.status(500).send(error);
                }
            });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

exports.getAddData = (req, res, next) => {
    try {
        mycon.execute(
            "SELECT adv.idadv,adv.city_idcity,adv.distric_iddistric,adv.cat_idcat,adv.deler,adv.adv_start_date,adv.adv_end_date,adv.adv_status,adv.adv_priority,details.iddetails,details.company_name,details.owner_name,details.address1,details.address2,details.address3,details.description,details.company_name_sinhala,details.owner_name_sihala,details.description_sinhala,details.con_phone,details.con_mobile,details.con_imo,details.con_viber,details.con_whatsapp,details.con_fb,details.con_web,details.con_youtube,details.details_other,details.adv_idadv,`user`.iduser,`user`.mobileno,`user`.email,`user`.pword,`user`.utypeId,distric.distric_english,distric.distric_sinhala,city.city_sinhala,city.city_english,cat.`name`,cat.sinhala FROM adv INNER JOIN details ON details.adv_idadv=adv.idadv INNER JOIN `user` ON `user`.iduser=adv.deler INNER JOIN distric ON distric.iddistric=adv.distric_iddistric INNER JOIN city ON city.distric_iddistric=distric.iddistric AND city.idcity=adv.city_idcity INNER JOIN cat ON cat.id=adv.cat_idcat WHERE adv.idadv=" + req.body.idadv
            , (error, rows, fildData) => {
                if (!error) {
                    res.send(rows);
                } else {
                    console.log(error);
                    res.status(500).send(error);
                }
            });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

exports.setActiveAdv = (req, res, next) => {
    try {
        mycon.execute(
            "UPDATE `adv` SET `adv_end_date`='" + req.body.exd + "',`adv_status`=1,`adv_priority`='" + req.body.priority + "' WHERE `idadv`= " + req.body.idadv
            , (error, rows, fildData) => {
                if (!error) {
                    res.send(rows);
                } else {
                    console.log(error);
                    res.status(500).send(error);
                }
            });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

exports.getActive = (req, res, next) => {
    try {
        mycon.execute("SELECT adv.idadv,adv.city_idcity,adv.distric_iddistric,adv.cat_idcat,adv.deler,adv.adv_start_date,adv.adv_end_date,adv.adv_status,adv.adv_priority,details.iddetails,details.company_name,details.owner_name,details.address1,details.address2,details.address3,details.description,details.company_name_sinhala,details.owner_name_sihala,details.description_sinhala,details.con_phone,details.con_mobile,details.con_imo,details.con_viber,details.con_whatsapp,details.con_fb,details.con_web,details.con_youtube,details.details_other,details.adv_idadv,image.idimage,image.image_path,image.image_status,cat.id,cat.`name` FROM adv INNER JOIN details ON details.adv_idadv=adv.idadv INNER JOIN image ON image.adv_idadv=adv.idadv INNER JOIN cat ON cat.id=adv.cat_idcat WHERE adv.adv_status=1 GROUP BY adv.idadv ORDER BY adv.adv_priority ASC", (error, rows, fildData) => {
            if (!error) {
                res.send(rows);
            } else {
                console.log(error);
                res.status(500).send(error);
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

exports.getActiveByDistict = (req, res, next) => {
    try {
        mycon.execute("SELECT adv.idadv,adv.city_idcity,adv.distric_iddistric,adv.cat_idcat,adv.deler,adv.adv_start_date,adv.adv_end_date,adv.adv_status,adv.adv_priority,details.iddetails,details.company_name,details.owner_name,details.address1,details.address2,details.address3,details.description,details.company_name_sinhala,details.owner_name_sihala,details.description_sinhala,details.con_phone,details.con_mobile,details.con_imo,details.con_viber,details.con_whatsapp,details.con_fb,details.con_web,details.con_youtube,details.details_other,details.adv_idadv,image.idimage,image.image_path,image.image_status,cat.id,cat.`name` FROM adv INNER JOIN details ON details.adv_idadv=adv.idadv INNER JOIN image ON image.adv_idadv=adv.idadv INNER JOIN cat ON cat.id=adv.cat_idcat WHERE adv.adv_status=1 AND adv.distric_iddistric= '" + req.body.id + "' GROUP BY adv.idadv ORDER BY adv.adv_priority ASC", (error, rows, fildData) => {
            if (!error) {
                res.send(rows);
            } else {
                console.log(error);
                res.status(500).send(error);
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}