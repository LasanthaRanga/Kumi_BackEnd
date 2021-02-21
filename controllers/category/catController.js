const mycon = require('../../util/conn');

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


exports.getAll = (req, res, next) => {
    console.log(req.body);
    try {
        let ar = [];
        mycon.execute("SELECT cat.id,cat.parent_id,cat.`name`,cat.`status`,cat.step,cat.sinhala FROM cat WHERE cat.site='" + req.body.site + "' ORDER BY cat.step ASC,cat.id ASC",
            (error, rows, fildData) => {
                len = rows.length;
                for (i = 0; i < len; i++) {
                    var e = rows[i];
                    var obj = {
                        id: e.id,
                        parent_id: e.parent_id,
                        name: e.name,
                        status: e.status,
                        sinhala: e.sinhala,
                        step: e.step,
                        child: []
                    }
                    if (obj.parent_id == 0) {
                        ar.push(obj); // Step 00
                    } else {
                        ar.forEach(a => {
                            if (obj.parent_id == a.id) {
                                a.child.push(obj);
                            }
                            a.child.forEach(aa => {
                                if (obj.parent_id == aa.id) {
                                    aa.child.push(obj);
                                }
                                aa.child.forEach(aaa => {
                                    if (obj.parent_id == aaa.id) {
                                        aaa.child.push(obj);
                                    }
                                    aaa.child.forEach(aaaa => {
                                        if (obj.parent_id == aaaa.id) {
                                            aaaa.child.push(obj);
                                        }
                                        aaaa.child.forEach(aaaaa => {
                                            if (obj.parent_id == aaaaa.id) {
                                                aaaaa.child.push(obj);
                                            }
                                            aaaaa.child.forEach(aaaaaa => {
                                                if (obj.parent_id == aaaaaa.id) {
                                                    aaaaaa.child.push(obj);
                                                }
                                            }); // Step 06
                                        }); // Step 05
                                    }); // Step 04
                                }); // Step 03
                            }); // Step 02
                        }); // Step 01
                    }  // Step 00              
                };
                res.send(ar);
            });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}


exports.getAllByMain = (req, res, next) => {
    var mid = req.body.mid;
    console.log("MID = " + mid);
    try {
        let ar = [];

        mycon.execute("SELECT cat.id,cat.parent_id,cat.`name`,cat.`status`,cat.step,cat.sinhala FROM cat ORDER BY cat.step ASC,cat.id ASC",
            (error, rows, fildData) => {
                len = rows.length;
                for (i = 0; i < len; i++) {
                    var e = rows[i];
                    var obj = {
                        id: e.id,
                        parent_id: e.parent_id,
                        name: e.name,
                        sinhala: e.sinhala,
                        status: e.status,
                        step: e.step,
                        child: []
                    }

                    if (obj.parent_id == 0) {
                        if (e.id == mid) {
                            ar.push(obj); // Step 00
                        }
                    } else {
                        ar.forEach(a => {
                            if (obj.parent_id == a.id) {
                                a.child.push(obj);
                            }
                            a.child.forEach(aa => {
                                if (obj.parent_id == aa.id) {
                                    aa.child.push(obj);
                                }
                                aa.child.forEach(aaa => {
                                    if (obj.parent_id == aaa.id) {
                                        aaa.child.push(obj);
                                    }
                                    aaa.child.forEach(aaaa => {
                                        if (obj.parent_id == aaaa.id) {
                                            aaaa.child.push(obj);
                                        }
                                        aaaa.child.forEach(aaaaa => {
                                            if (obj.parent_id == aaaaa.id) {
                                                aaaaa.child.push(obj);
                                            }
                                            aaaaa.child.forEach(aaaaaa => {
                                                if (obj.parent_id == aaaaaa.id) {
                                                    aaaaaa.child.push(obj);
                                                }
                                            }); // Step 06
                                        }); // Step 05
                                    }); // Step 04
                                }); // Step 03
                            }); // Step 02
                        }); // Step 01
                    }  // Step 00       


                };
                res.send(ar);
            });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}



exports.addCat = (req, res, next) => {
    try {
        mycon.execute("INSERT INTO `cat`( `parent_id`, `name`, `status`, `step`, `sinhala`,`site`) VALUES ( '" + this.rES(req.body.parent_id) + "', '" + this.rES(req.body.ename) + "','1', '" + this.rES(req.body.step) + "',  '" + this.rES(req.body.sname) + "','" + req.body.site + "')", (error, rows, fildData) => {
            if (!error) {
                console.log(rows);
                res.send(rows);
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

var cats = [];
var round = 0;
var stepsyes = 0;
var stepsNo = 0;

var adds;

exports.getAllSubCats = (req, res, next) => {
    cats = [];
    this.round = 0;
    // console.log(req.body);

    this.methods(req.body.id, req.body.site);

    setTimeout(function () {
        let catsids = '';
        var len = cats.length;
        for (var i = 0; i < len; i++) {
            if (i == len - 1) {
                catsids += cats[i].id + ',' + req.body.id;
            } else {
                catsids += cats[i].id + ',';
            }
        }

        if (len == 0) {
            catsids = req.body.id;
        }

        console.log(catsids);
        res.send({ ids: catsids });

    }, 300);
}

exports.methods = (id, site) => {

    // console.log('=============');
    // console.log(site);
    // console.log('=============');

    try {
        mycon.execute("SELECT cat.id,cat.parent_id,cat.`name`,cat.`status`,cat.step,cat.sinhala,cat.site FROM cat WHERE cat.parent_id='" + id + "' AND cat.site='" + site + "'", (error, rows, fildData) => {
            if (!error) {
                rows.forEach(e => {
                    cats.push(e);
                    this.methods(e.id, site);
                });
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}


exports.getAddsByCats = (req, res, next) => {
    try {
        var day = dateFormat(new Date(), "yyyy-mm-dd");
        mycon.execute(
            "SELECT adv.idadv,adv.city_idcity,adv.distric_iddistric,adv.cat_idcat,adv.deler,adv.adv_start_date,adv.adv_end_date,adv.adv_status,adv.adv_priority,details.iddetails,details.company_name,details.owner_name,details.address1,details.address2,details.address3,details.description,details.company_name_sinhala,details.owner_name_sihala,details.description_sinhala,details.con_phone,details.con_mobile,details.con_imo,details.con_viber,details.con_whatsapp,details.con_fb,details.con_web,details.con_youtube,details.details_other,details.adv_idadv,image.idimage,image.image_path,image.image_status,cat.id,cat.`name` FROM adv INNER JOIN details ON details.adv_idadv=adv.idadv INNER JOIN image ON image.adv_idadv=adv.idadv INNER JOIN cat ON cat.id=adv.cat_idcat WHERE adv.adv_status=1 AND adv.cat_idcat  " +
            " IN (" + req.body.list + ") AND adv_end_date>= '" + day + "' " +
            " GROUP BY adv.idadv ORDER BY adv.idadv DESC",
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

exports.getAddsByCatsAndDis = (req, res, next) => {
    try {
        var day = dateFormat(new Date(), "yyyy-mm-dd");
        mycon.execute(
            "SELECT adv.idadv,adv.city_idcity,adv.distric_iddistric,adv.cat_idcat,adv.deler,adv.adv_start_date,adv.adv_end_date,adv.adv_status,adv.adv_priority,details.iddetails,details.company_name,details.owner_name,details.address1,details.address2,details.address3,details.description,details.company_name_sinhala,details.owner_name_sihala,details.description_sinhala,details.con_phone,details.con_mobile,details.con_imo,details.con_viber,details.con_whatsapp,details.con_fb,details.con_web,details.con_youtube,details.details_other,details.adv_idadv,image.idimage,image.image_path,image.image_status,cat.id,cat.`name` FROM adv INNER JOIN details ON details.adv_idadv=adv.idadv INNER JOIN image ON image.adv_idadv=adv.idadv INNER JOIN cat ON cat.id=adv.cat_idcat WHERE adv.adv_status=1 AND adv.cat_idcat  " +
            " IN (" + req.body.list + ")  AND  adv.distric_iddistric = '" + req.body.id + "' AND adv_end_date>= '" + day + "' " +
            " GROUP BY adv.idadv ORDER BY adv.idadv DESC",
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

exports.getAddsByCatsAndCity = (req, res, next) => {
    try {
        var day = dateFormat(new Date(), "yyyy-mm-dd");
        mycon.execute(
            "SELECT adv.idadv,adv.city_idcity,adv.distric_iddistric,adv.cat_idcat,adv.deler,adv.adv_start_date,adv.adv_end_date,adv.adv_status,adv.adv_priority,details.iddetails,details.company_name,details.owner_name,details.address1,details.address2,details.address3,details.description,details.company_name_sinhala,details.owner_name_sihala,details.description_sinhala,details.con_phone,details.con_mobile,details.con_imo,details.con_viber,details.con_whatsapp,details.con_fb,details.con_web,details.con_youtube,details.details_other,details.adv_idadv,image.idimage,image.image_path,image.image_status,cat.id,cat.`name` FROM adv INNER JOIN details ON details.adv_idadv=adv.idadv INNER JOIN image ON image.adv_idadv=adv.idadv INNER JOIN cat ON cat.id=adv.cat_idcat WHERE adv.adv_status=1 AND adv.cat_idcat  " +
            " IN (" + req.body.list + ")  AND  adv.city_idcity = '" + req.body.id + "' AND adv_end_date>= '" + day + "'" +
            " GROUP BY adv.idadv ORDER BY adv.idadv DESC",
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




exports.getMainCats = (req, res, next) => {
    console.log(req.body);
    try {
        mycon.execute(
            "SELECT cat.id,cat.parent_id,cat.`name`,cat.`status`,cat.step,cat.sinhala,cat.imagePath,cat.description,cat.site FROM cat WHERE cat.parent_id=0 AND cat.site='" + req.body.site + "' ORDER BY cat.id ASC",
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

exports.saveCity = (req, res, next) => {
    try {
        mycon.execute(
            "INSERT INTO  `city`(  `city_sinhala`, `city_english`, `city_status`, `distric_iddistric`)" +
            " VALUES (  '" + this.rES(req.body.sinhala) + "', '" + this.rES(req.body.english) + "', 1, '" + req.body.dis + "')",
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



