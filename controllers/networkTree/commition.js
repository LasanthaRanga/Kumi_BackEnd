const mycon = require('../../util/conn');
const userController = require('../userControllers/user');
const jwt = require('jsonwebtoken');
const bcript = require('bcrypt');
var dateFormat = require('dateformat');


exports.realEscapeString = (str) => {
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
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

exports.balancePoint = (req, res, next) => {
    try {
        mycon.execute("SELECT sw_tree.swTreeId,sw_tree.userId,sw_tree.commitionId FROM sw_tree WHERE sw_tree.swTreeId=" + req.body.tid,
            (error, rows, fildData) => {
                if (!error) {
                    //  console.log(rows);
                    var data = rows[0];
                    //   console.log(data.userId + " -- " + data.commitionId);
                    mycon.execute("DELETE from sw_point WHERE treeid = '" + req.body.tid + "' and Side = '" + req.body.side + "'", (e, r, f) => {
                        if (!e) {
                            var point = req.body.point;
                            for (var x = 0; x < point; x++) {
                                //        console.log(x);
                                mycon.execute("INSERT INTO `sw_point` (  `userId`, `commitionId`, `invoiceId`, `Side`, `point`, `status`, `treeid` ) "
                                    + " VALUES	(  " + data.userId + ", " + data.commitionId + ", 1, '" + req.body.side + "', 1, 1, '" + req.body.tid + "' )",
                                    (ee, rr, ff) => {
                                        if (ee) {
                                            console.log(ee);
                                        }
                                    });
                            }
                        }
                    });
                    res.send(rows);
                }
            });

    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}




exports.process = (req, res, next) => {
    try {
        mycon.execute("SELECT sw_tree.swTreeId, sw_tree.commitionId, sw_tree.userId  FROM sw_tree WHERE sw_tree.`status`= 1",
            (e, r, f) => {
                if (!e) {
                    this.processA(req, res, next, r);
                }
                res.send({ ok: "ok" });
            });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}


exports.processA = (req, res, next, r) => {
    try {
        let x = 0;

        var day = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");

        mycon.execute("INSERT INTO `sw_process`(`dateTime`) VALUES ('" + day + "')", (er, ro, fi) => {
            if (!er) {
                let proid = ro.insertId


                r.forEach(el => {
                    x++;
                    let tid = el.swTreeId;
                    let comid = el.commitionId;
                    let ap = 0;
                    let bp = 0;
                    let uid = el.userId;
                    mycon.execute("SELECT Sum(sw_point.point) point FROM sw_point WHERE sw_point.treeid='" + tid + "' AND sw_point.`status`=1 AND sw_point.Side='A'", (ee, rr, f) => {
                        if (!ee) {
                            if (rr[0].point != null) { ap = rr[0].point; }
                            mycon.execute("SELECT Sum(sw_point.point) point FROM sw_point WHERE sw_point.treeid='" + tid + "' AND sw_point.`status`=1 AND sw_point.Side='B'", (eee, rrr, f) => {
                                if (!eee) {
                                    if (rrr[0].point != null) { bp = rrr[0].point; }
                                    var obj = {
                                        tid: tid,
                                        comid: comid,
                                        ap: ap,
                                        bp: bp,
                                        proid: proid,
                                        uid: uid,
                                    };
                                    this.processB(req, res, next, obj);
                                }
                            });
                        }
                    });
                });
            } else {
                console.log(er);
            }
        });



    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

exports.processB = (req, res, next, d) => {
    try {
        if (d.ap > 0 && d.bp > 0) {
            //   console.log(d.tid + "  -  " + d.ap + "  - " + d.bp + " --- " + d.proid + "-----" + d.uid);

            let ca = d.ap; let cb = d.bp;
            let round = 0;
            let breakBy = '';

            for (var i = 1; i < 5; i++) {
                round = i;
                //     console.log(i);
                ca = ca - 1; cb = cb - 1;
                //      console.log(ca + '  ' + cb);

                if (ca == 0 && cb == 0) {
                    breakBy = 'AB';
                    break;
                }
                if (cb == 0) {
                    breakBy = 'B';
                    break;
                }
                if (ca == 0) {
                    breakBy = 'A';
                    break;
                }

            }
            let comition = 2 * round * 1000;
            //   console.log('round ' + round + '   -  ' + comition);


            let obj = {
                uid: d.uid,
                tid: d.tid,
                comid: d.comid,
                prosid: d.proid,
                amount: comition,
                round: round
            }

            this.processC(req, res, next, obj);


            if (round == 4) {

            } else {
                if (breakBy == 'AB') {

                } else if (breakBy == 'A') {

                } else if (breakBy == 'B') {

                }
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}


exports.processC = (req, res, next, d) => {

    try {
        mycon.execute("INSERT INTO  `sw_pointcommition`(  `user_id`, `tree_id`, `commition_id`, `process_id`, `amount`, `status`)" +
            " VALUES (  '" + d.uid + "', '" + d.tid + "', '" + d.comid + "', '" + d.prosid + "', '" + d.amount + "', 1)", (ee, rr, ff) => {
                if (!ee) {
                    //      console.log(rr.insertId);
                    let pintcom = rr.insertId;
                    //     console.log("-------------------------------  " + d.comid);
                    mycon.execute("SELECT sw_commition.userId,sw_commition.introducerid,sw_commition.introducerCommitionId FROM sw_commition WHERE sw_commition.idCommition=" + d.comid, (eee, rrr, ff) => {
                        if (!eee) {
                            //          console.log("++++++++++++++++++++++++++++++++++++++++++++++ " + rrr[0].introducerid);
                            let introid = rrr[0].introducerid;
                            let introcom = rrr[0].introducerCommitionId;
                            let comiton = d.amount * 10 / 100;
                            mycon.execute("INSERT INTO `sw_introcommition`( `user_id`, `tree_id`, `process_id`, `commition_id`, `pointcom_id`, `amount`, `status`) "
                                + " VALUES ( '" + introid + "', '" + d.tid + "', '" + d.prosid + "', '" + d.comid + "', '" + pintcom + "', '" + comiton + "', 1)", (e, r, f) => {
                                    if (!e) {
                                        //                      console.log(r);
                                        let obj = {
                                            tid: d.tid,
                                            pintcom: pintcom,
                                            prosid: d.prosid,
                                            round: d.round
                                        }
                                        this.processD(req, res, next, obj);
                                    } else {
                                        console.log(e);
                                    }
                                });
                        } else {
                            console.log(eee);
                        }
                    });
                }
            });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }

}


exports.processD = (req, res, next, d) => {
    try {

        let obj = {
            tid: d.tid,
            pintcom: d.pintcom,
            prosid: d.prosid,
            round: d.round,
            pid: 0,
        }
        //   console.log(obj);

        var BreakException = {};

        mycon.execute("SELECT sw_point.idPoint,sw_point.Side,sw_point.point,sw_point.`status`,sw_point.treeid FROM sw_point WHERE sw_point.treeid='" + d.tid + "' AND sw_point.`status`=1 AND sw_point.Side='A' ORDER BY sw_point.idPoint ASC", (e, r, f) => {
            if (!e) {
                let x = 0;

                try {
                    r.forEach(el => {
                        x++;
                        if (d.round == 4) {
                            obj.pid = el.idPoint;
                            this.processE(req, res, next, obj);
                        } else {
                            obj.pid = el.idPoint;
                            this.processE(req, res, next, obj);
                            if (d.round == x) {
                                throw BreakException;
                            }
                        }
                    });
                } catch (er) {
                    //        console.log('Brake A');
                }
            }
        });

        mycon.execute("SELECT sw_point.idPoint,sw_point.Side,sw_point.point,sw_point.`status`,sw_point.treeid FROM sw_point WHERE sw_point.treeid='" + d.tid + "' AND sw_point.`status`=1 AND sw_point.Side='B' ORDER BY sw_point.idPoint ASC", (e, r, f) => {
            if (!e) {
                let y = 0;
                try {
                    r.forEach(el => {
                        y++;
                        if (d.round == 4) {
                            obj.pid = el.idPoint;
                            this.processE(req, res, next, obj);
                        } else {
                            obj.pid = el.idPoint;
                            this.processE(req, res, next, obj);
                            if (d.round == y) {
                                throw BreakException;
                            }
                        }
                    });
                } catch (er) {
                    //        console.log('Brake B');
                }
            }
        })

    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

exports.processE = (req, res, next, d) => {
    try {
        mycon.execute("UPDATE `sw_point` SET `status`= 2,`process_id`= '" + d.prosid + "',`pointcom_id`= '" + d.pintcom + "' WHERE `idPoint`=" + d.pid, (e, r, f) => {
            if (!e) {
                //            console.log(r);
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}


exports.getProcess = (req, res, next) => {
    try {
        mycon.execute("SELECT sw_process.idProcess,sw_process.dateTime FROM sw_process ORDER BY sw_process.idProcess DESC", (e, r, f) => {
            if (!e) {
                res.send(r);
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

exports.getPointCommitonList = (req, res, next) => {
    try {
        mycon.execute("SELECT sw_pointcommition.idPointcomition,sw_pointcommition.user_id,sw_pointcommition.tree_id,sw_pointcommition.commition_id,sw_pointcommition.process_id,sw_pointcommition.amount,sw_pointcommition.`status`,GROUP_CONCAT(uservalue.`value` SEPARATOR '  -  ') as udata FROM sw_pointcommition INNER JOIN uservalue ON uservalue.userId=sw_pointcommition.user_id WHERE sw_pointcommition.process_id='" + req.body.processID + "' AND (uservalue.keyId=2 OR uservalue.keyId=16 OR uservalue.keyId=17 OR uservalue.keyId=18) GROUP BY sw_pointcommition.idPointcomition", (e, r, f) => {
            if (!e) {
                res.send(r);
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

exports.getIntroCommitonList = (req, res, next) => {
    try {
        mycon.execute("SELECT GROUP_CONCAT(uservalue.`value` SEPARATOR '  -  ') AS udata,sw_introcommition.idIntrocommiton,sw_introcommition.user_id,sw_introcommition.tree_id,sw_introcommition.pointcom_id,sw_introcommition.amount,sw_introcommition.`status`,uservalue.`value`,sw_introcommition.commition_id,sw_introcommition.process_id FROM uservalue INNER JOIN sw_introcommition ON uservalue.userId=sw_introcommition.user_id WHERE (uservalue.keyId=2 OR uservalue.keyId=16 OR uservalue.keyId=17 OR uservalue.keyId=18) AND sw_introcommition.process_id='" + req.body.processID + "' GROUP BY sw_introcommition.idIntrocommiton", (e, r, f) => {
            if (!e) {
                res.send(r);
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}


exports.getPointCommitonByUser = (req, res, next) => {
    try {
        mycon.execute("SELECT sw_pointcommition.idPointcomition,sw_pointcommition.user_id,sw_pointcommition.tree_id,sw_pointcommition.commition_id,sw_pointcommition.process_id,sw_pointcommition.amount,sw_pointcommition.`status`,GROUP_CONCAT(uservalue.`value` SEPARATOR '  -  ') AS udata,sw_process.dateTime FROM sw_pointcommition INNER JOIN uservalue ON uservalue.userId=sw_pointcommition.user_id INNER JOIN sw_process ON sw_pointcommition.process_id=sw_process.idProcess WHERE (uservalue.keyId=2 OR uservalue.keyId=16 OR uservalue.keyId=17 OR uservalue.keyId=18) AND sw_pointcommition.user_id='" + req.body.uid + "' GROUP BY sw_pointcommition.idPointcomition", (e, r, f) => {
            if (!e) {
                res.send(r);
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}


exports.getIntroCommitonByUser = (req, res, next) => {
    try {
        mycon.execute("SELECT GROUP_CONCAT(uservalue.`value` SEPARATOR '  -  ') AS udata,sw_introcommition.idIntrocommiton,sw_introcommition.user_id,sw_introcommition.tree_id,sw_introcommition.pointcom_id,sw_introcommition.amount,sw_introcommition.`status`,uservalue.`value`,sw_introcommition.commition_id,sw_introcommition.process_id,sw_process.dateTime FROM uservalue INNER JOIN sw_introcommition ON uservalue.userId=sw_introcommition.user_id INNER JOIN sw_process ON sw_introcommition.process_id=sw_process.idProcess WHERE (uservalue.keyId=2 OR uservalue.keyId=16 OR uservalue.keyId=17 OR uservalue.keyId=18) AND uservalue.userId='" + req.body.uid + "' GROUP BY sw_introcommition.idIntrocommiton", (e, r, f) => {
            if (!e) {
                res.send(r);
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}


exports.getPointCommitonByUserDates = (req, res, next) => {


    var from = dateFormat(new Date(req.body.from), "yyyy-mm-dd");
    var to = dateFormat(new Date(req.body.to), "yyyy-mm-dd");
    // console.log(from + "  -  " + to);

    try {
        mycon.execute("SELECT sw_pointcommition.idPointcomition,sw_pointcommition.user_id,sw_pointcommition.tree_id,sw_pointcommition.commition_id,sw_pointcommition.process_id,sw_pointcommition.amount,sw_pointcommition.`status`,GROUP_CONCAT(uservalue.`value` SEPARATOR '  -  ') AS udata,sw_process.dateTime FROM sw_pointcommition INNER JOIN uservalue ON uservalue.userId=sw_pointcommition.user_id INNER JOIN sw_process ON sw_pointcommition.process_id=sw_process.idProcess WHERE (uservalue.keyId=2 OR uservalue.keyId=16 OR uservalue.keyId=17 OR uservalue.keyId=18) AND sw_pointcommition.user_id='" + req.body.uid + "'  AND sw_process.dateTime BETWEEN '" + from + "' AND '" + to + "'  GROUP BY sw_pointcommition.idPointcomition", (e, r, f) => {
            if (!e) {
                res.send(r);
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}


exports.getIntroCommitonByUserDates = (req, res, next) => {
    var from = dateFormat(new Date(req.body.from), "yyyy-mm-dd");
    var to = dateFormat(new Date(req.body.to), "yyyy-mm-dd");
    // console.log(from + "  -  " + to);
    try {
        mycon.execute("SELECT GROUP_CONCAT(uservalue.`value` SEPARATOR '  -  ') AS udata,sw_introcommition.idIntrocommiton,sw_introcommition.user_id,sw_introcommition.tree_id,sw_introcommition.pointcom_id,sw_introcommition.amount,sw_introcommition.`status`,uservalue.`value`,sw_introcommition.commition_id,sw_introcommition.process_id,sw_process.dateTime FROM uservalue INNER JOIN sw_introcommition ON uservalue.userId=sw_introcommition.user_id INNER JOIN sw_process ON sw_introcommition.process_id=sw_process.idProcess WHERE (uservalue.keyId=2 OR uservalue.keyId=16 OR uservalue.keyId=17 OR uservalue.keyId=18) AND uservalue.userId='" + req.body.uid + "' AND sw_process.dateTime BETWEEN '" + from + "' AND '" + to + "' GROUP BY sw_introcommition.idIntrocommiton", (e, r, f) => {
            if (!e) {
                res.send(r);
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

