const mycon = require('../../util/conn');
const jwt = require('jsonwebtoken');
var dateFormat = require('dateformat');
const { query } = require('express');



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

        mycon.execute("SELECT tree.idTree FROM tree WHERE tree.userId=" + req.body.user, (e, r, f) => {
            if (!e) {
                let tid = r[0].idTree;
                console.log(r);
                console.log(tid);


                mycon.execute("INSERT INTO `adv` ( `city_idcity`, `distric_iddistric`, `cat_idcat`, `deler`, `adv_start_date`, `adv_end_date`, `adv_status`, `adv_priority`, `site`,`iduser`) " +
                    " VALUES 	(  '" + this.rES(req.body.city) + "', '" + this.rES(req.body.distric) + "', '" + this.rES(req.body.lastSelected) + "', '" + this.rES(req.body.user) + "', '" + day + "', NULL, 0, NULL,'" + req.body.site + "','" + tid + "' )",
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

            } else {
                console.log(e);
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
            "   INNER JOIN details ON details.adv_idadv=adv.idadv LEFT JOIN image ON image.adv_idadv=adv.idadv " +
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
                    this.afterActive(req, res, next);
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


exports.afterActive = (req, res, next) => {
    try {
        var day = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
        mycon.execute("SELECT adv.deler,adv.iduser FROM adv WHERE adv.idadv=" + req.body.idadv, (error, rows, fildData) => {
            if (!error) {

                let deler = rows[0].deler;
                let tid = rows[0].iduser;

                let qq = "UPDATE `tree` SET `status`=1,`string1`='" + req.body.idadv + "',`string2`='" + day + "' WHERE `idTree`=" + tid;

                mycon.execute(qq, (e, r, f) => {
                    if (!e) {
                        this.calPoints(tid, req.body.idadv);
                        res.send(r);
                    } else {
                        console.log(e);
                        res.status(500).send(error);
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


exports.calPoints = async (tid, addid) => {
    try {

        let points = [];
        var day = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
        mycon.execute("SELECT tree.idTree,tree.parent,tree.layer,tree.userId,tree.`status` FROM tree WHERE idTree = " + tid, (error, rows, fildData) => {
            if (!error) {

                mycon.execute("SELECT `level`.`level`,`level`.cost FROM `level` WHERE `level`.`status`= 1 ORDER BY `level`.`level` ASC", (e, r, f) => {
                    if (!e) {
                        points = r;

                        let userId = rows[0].userId;
                        let parent = rows[0].parent;
                        let pp = 0;
                        let i = 0;

                        let cost = points[0].cost;
                        let level = points[0].level

                        let qqq = "INSERT INTO`ml_commitions`( `userid`, `treeid`, `addid`, `amount`, `level`, `status`, `added`) " +
                            "  VALUES( " + userId + ", " + tid + ", " + addid + "," + cost + ", " + level + ", 1, '" + day + "')";
                        mycon.execute(qqq, (eee, rrr, fildData) => {
                            if (!error) {

                            } else {
                                console.log(eee);
                            }
                        });


                        cost = points[1].cost;
                        level = points[1].level
                        let query = "SELECT tree.idTree,tree.parent,tree.layer,tree.userId,tree.`status` FROM tree WHERE idTree = "

                        mycon.execute(query + parent, (ee, r1, ff) => {
                            if (!ee) {

                                if (r1.length > 0) {
                                    let uid = r1[0].userId;
                                    let treeId = r1[0].idTree;
                                    let status = r1[0].status;
                                    parent = r1[0].parent;
                                    if (status == 1) {
                                        this.addPoints(uid, treeId, addid, cost, level, day);
                                    }

                                    cost = points[2].cost;
                                    level = points[2].level

                                    mycon.execute(query + parent, (ee, r2, ff) => {
                                        if (!ee) {

                                            if (r2.length > 0) {
                                                uid = r2[0].userId;
                                                treeId = r2[0].idTree;
                                                status = r2[0].status;
                                                parent = r2[0].parent;
                                                if (status == 1) {
                                                    this.addPoints(uid, treeId, addid, cost, level, day);
                                                }
                                                cost = points[3].cost;
                                                level = points[3].level
                                                //-------------- 3
                                                mycon.execute(query + parent, (ee, r3, ff) => {
                                                    if (!ee) {

                                                        if (r3.length > 0) {
                                                            uid = r3[0].userId;
                                                            treeId = r3[0].idTree;
                                                            status = r3[0].status;
                                                            parent = r3[0].parent;
                                                            if (status == 1) {
                                                                this.addPoints(uid, treeId, addid, cost, level, day);
                                                            }
                                                            cost = points[4].cost;
                                                            level = points[4].level
                                                            //------------ 4

                                                            mycon.execute(query + parent, (ee, r4, ff) => {
                                                                if (!ee) {

                                                                    if (r4.length > 0) {
                                                                        uid = r4[0].userId;
                                                                        treeId = r4[0].idTree;
                                                                        status = r4[0].status;
                                                                        parent = r4[0].parent;
                                                                        if (status == 1) {
                                                                            this.addPoints(uid, treeId, addid, cost, level, day);
                                                                        }
                                                                        cost = points[5].cost;
                                                                        level = points[5].level
                                                                        //============= 5

                                                                        mycon.execute(query + parent, (ee, r5, ff) => {
                                                                            if (!ee) {

                                                                                if (r5.length > 0) {
                                                                                    uid = r5[0].userId;
                                                                                    treeId = r5[0].idTree;
                                                                                    status = r5[0].status;
                                                                                    parent = r5[0].parent;
                                                                                    if (status == 1) {
                                                                                        this.addPoints(uid, treeId, addid, cost, level, day);
                                                                                    }
                                                                                    cost = points[6].cost;
                                                                                    level = points[6].level
                                                                                    //--------------- 6

                                                                                    mycon.execute(query + parent, (ee, r6, ff) => {
                                                                                        if (!ee) {

                                                                                            if (r6.length > 0) {
                                                                                                uid = r6[0].userId;
                                                                                                treeId = r6[0].idTree;
                                                                                                status = r6[0].status;
                                                                                                parent = r6[0].parent;
                                                                                                if (status == 1) {
                                                                                                    this.addPoints(uid, treeId, addid, cost, level, day);
                                                                                                }
                                                                                                cost = points[7].cost;
                                                                                                level = points[7].level
                                                                                                //--------------- 7


                                                                                                mycon.execute(query + parent, (ee, r7, ff) => {
                                                                                                    if (!ee) {

                                                                                                        if (r7.length > 0) {
                                                                                                            uid = r7[0].userId;
                                                                                                            treeId = r7[0].idTree;
                                                                                                            status = r7[0].status;
                                                                                                            parent = r7[0].parent;
                                                                                                            if (status == 1) {
                                                                                                                this.addPoints(uid, treeId, addid, cost, level, day);
                                                                                                            }
                                                                                                            cost = points[8].cost;
                                                                                                            level = points[8].level
                                                                                                            //--------------- 8
                                                                                                            //8 weni level eka start karanna one methanin




                                                                                                        } else {
                                                                                                            console.log("nullllllllllllll 7");
                                                                                                        }
                                                                                                    } else {
                                                                                                        console.log(ee);
                                                                                                    }
                                                                                                }); // ============================7


                                                                                            } else {
                                                                                                console.log("nullllllllllllll 6");
                                                                                            }
                                                                                        } else {
                                                                                            console.log(ee);
                                                                                        }
                                                                                    }); // ============================6


                                                                                } else {
                                                                                    console.log("nullllllllllllll 5");
                                                                                }
                                                                            } else {
                                                                                console.log(ee);
                                                                            }
                                                                        }); // ============================5


                                                                    } else {
                                                                        console.log("nullllllllllllll 4");
                                                                    }
                                                                } else {
                                                                    console.log(ee);
                                                                }
                                                            }); // ============================4


                                                        } else {
                                                            console.log("nullllllllllllll 3");
                                                        }
                                                    } else {
                                                        console.log(ee);
                                                    }
                                                }); // ============================3



                                            } else {
                                                console.log("nullllllllllllll 2");
                                            }
                                        } else {
                                            console.log(ee);
                                        }
                                    }); // ============================2


                                } else {
                                    console.log("nullllllllllllll 1");
                                }
                            } else {
                                console.log(ee);
                            }
                        }); // ================================1

                    }
                })
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



exports.addPoints = (uid, tid, addid, amount, level, day) => {
    try {

        let qq = "INSERT INTO`ml_commitions`( `userid`, `treeid`, `addid`, `amount`, `level`, `status`, `added`) " +
            "  VALUES( " + uid + ", " + tid + ", " + addid + "," + amount + ", " + level + ", 1, '" + day + "')";
        mycon.execute(qq, (error, rows, fildData) => {
            if (!error) {
                //  console.log(rows);
            } else {
                console.log(error);
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