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

exports.getFullTree = (req, res, next) => {
    try {
        mycon.execute("SELECT sw_tree.swTreeId AS id,sw_tree.swTreeId AS title,sw_tree.parentId AS pid,sw_tree.A,sw_tree.B,sw_tree.userId,sw_tree.APoint,sw_tree.BPoint,sw_tree.layar,sw_tree.`status`,sw_tree.userName AS img,sw_tree.other1,sw_tree.other2,`user`.idUser as point,`user`.email,uservalue.`value` AS name,uservalue.keyId FROM sw_tree INNER JOIN `user` ON `user`.idUser=sw_tree.userId LEFT JOIN uservalue ON uservalue.userId=`user`.idUser WHERE uservalue.keyId=2",
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

exports.getFreePins = (req, res, next) => {
    try {
        mycon.execute("SELECT sw_tree.swTreeId,sw_tree.parentId,sw_tree.A,sw_tree.B,sw_tree.userId,sw_tree.commitionId,sw_tree.APoint,sw_tree.BPoint,sw_tree.layar,sw_tree.`status`,sw_tree.userName,sw_tree.other1,sw_tree.other2 FROM sw_tree WHERE sw_tree.userId= '" + req.body.swid + "' AND (sw_tree.A IS NULL OR sw_tree.B IS NULL)",
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


exports.getNotActive = (req, res, next) => {
    try {
        mycon.execute("SELECT sw_tree.swTreeId,sw_tree.parentId,sw_tree.A,sw_tree.B,sw_tree.userId,sw_tree.commitionId,sw_tree.APoint,sw_tree.BPoint,sw_tree.layar,sw_tree.`status`,sw_tree.userName,sw_tree.other1,sw_tree.other2 FROM sw_tree WHERE sw_tree.userId='" + req.body.swid + "' AND sw_tree.commitionId IS NULL",
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


exports.saveCustomer = (param, prod, tid, rnext) => {


    try {
        var day = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
        mycon.execute("INSERT INTO `customer` ( `adl1`, `adl2`, `adl3`, `city`, `status`, `mobile`, `tp`, `user_id`, `register_date`, `product_id`, `name` ) " +
            " VALUES 	( '" + this.realEscapeString(param.cusAddressl1) + "', '" + this.realEscapeString(param.cusAddressl2) + "', '" + this.realEscapeString(param.cusAddressl3) + "', '" + this.realEscapeString(param.cusCity) + "', 1, '" + this.realEscapeString(param.cusTpno) + "', '" + this.realEscapeString(param.cusNic) + "', " + tid + ",'" + day + "', '" + prod + "',  '" + this.realEscapeString(param.cusName) + "' )",
            (error, rows, fildData) => {
                if (!error) {
                    rnext(rows);
                } else {
                    console.log(error);
                }
            });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}




exports.activeNode = (req, res, next) => {
    try {
        //    console.log(req.body);
        var day = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");

        mycon.execute("SELECT sw_prod.idProd,sw_prod.prodName,sw_prod.prodImage,sw_prod.prodPrice,sw_prod.prodPoint,sw_prod.prodOther,sw_prod.prodStatus FROM sw_prod WHERE sw_prod.idProd=" + req.body.product,
            (e, r, f) => {
                if (!e) {
                    let prod = r[0];
                    mycon.execute("INSERT INTO  `sw_invoice` (   `date`, `userId`, `totalValue`, `productId`, `pin` )" +
                        " VALUES	(   '" + day + "', '" + req.body.swid + "', '" + req.body.firstPay + "', '" + req.body.product + "','" + req.body.aPin + "' )", (ee, rr, f) => {
                            if (!ee) {
                                let invoiceID = rr.insertId;
                                mycon.execute("INSERT INTO `sw_installment` ( `userId`, `invoiceId`, `paidAmount`, `prodId`, `paidDate`, `status`, `pin` )" +
                                    " VALUES	( '" + req.body.swid + "', '" + invoiceID + "', '" + req.body.firstPay + "', '" + prod.idProd + "', '" + day + "', 1 ,'" + req.body.aPin + "')", (eee, rrr, f) => {
                                        if (!eee) {
                                            mycon.execute("SELECT sw_commition.idCommition,sw_commition.register_date,sw_commition.userId,sw_commition.introducerid,sw_commition.introducerCommitionId,sw_commition.`status` FROM sw_commition WHERE sw_commition.userId='" + req.body.swid + "' ORDER BY sw_commition.idCommition ASC", (er, ro, ff) => {
                                                if (!er) {
                                                    let introCom = ro[0].idCommition;

                                                    mycon.execute("INSERT INTO `sw_commition`(`register_date`, `userId`, `introducerid`, `introducerCommitionId`, `status`) " +
                                                        " VALUES ('" + day + "', " + req.body.swid + ", " + req.body.swid + ", " + introCom + ", 1)", (eeee, rrrr, f) => {
                                                            if (!eeee) {
                                                                let comid = rrrr.insertId;
                                                                mycon.execute("UPDATE `sw_tree` SET `commitionId`='" + comid + "' ,`status` = 1 ,`userName` = '../../../assets/img/profile.png' WHERE `swTreeId`=" + req.body.aPin, (error, rows, fi) => {
                                                                    if (!error) {
                                                                        let object = { "idMain": req.body.aPin, "A": 0, "B": 0, extra: '' }
                                                                        this.addPoint({ tid: req.body.aPin, obj: object, invoice: invoiceID }, res, next);
                                                                        ///  res.send(rrrr);
                                                                    } else {
                                                                        console.log(error);
                                                                    }
                                                                });
                                                            } else {
                                                                console.log(eeee)
                                                            }
                                                        });
                                                } else {
                                                    console.log(ro);
                                                }
                                            });
                                        } else {
                                            console.log(eee);
                                        }
                                    });
                            } else {
                                console.log(ee);
                            }
                        });
                } else {
                    console.log(e);
                }
            });

    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

exports.newPlacement = (req, res, next) => {
    try {

        let b = req.body;
        let userID = b.userData;
        var day = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
        //  console.log(req.body);

        mycon.execute("SELECT sw_prod.idProd,sw_prod.prodName,sw_prod.prodImage,sw_prod.prodPrice,sw_prod.prodPoint,sw_prod.prodOther,sw_prod.prodStatus FROM sw_prod WHERE sw_prod.idProd=" + b.product, (eee, rrr, fff) => {
            if (!eee) {
                let prod = rrr[0];

                if (b.type === 'other') {

                    this.saveCustomer(b.purchaser, prod.idProd, userID, ddd => {
                        // console.log("++++++++++++");
                        // console.log(ddd);
                        // console.log("++++++++++++++");

                        mycon.execute("INSERT INTO  `sw_invoice` (   `date`, `userId`, `totalValue`, `productId`, `cusid` )" +
                            " VALUES	(   '" + day + "', '" + userID + "', '" + b.firstPay + "', '" + prod.idProd + "','" + ddd.insertId + "' )", (er, ro, fi) => {
                                if (!er) {
                                    let invoiceID = ro.insertId;
                                    let para = {
                                        uid: userID,
                                        parent: b.aPin,
                                        side: b.side,
                                        point: prod.prodPoint,
                                        intro: b.introUid,
                                        invoice: invoiceID,
                                    }

                                    // console.log("000000000000000000000000000000000000000");
                                    // console.log(para);
                                    // console.log("000000000000000000000000000000000000000");

                                    this.addOneToTree(para, res, next);

                                    userController.sendLoginInformation(userID);

                                    // console.log("================================================== " + userID + " for sms")

                                    mycon.execute("INSERT INTO `sw_installment` ( `userId`, `invoiceId`, `paidAmount`, `prodId`, `paidDate`, `status` )" +
                                        " VALUES	( '" + userID + "', '" + invoiceID + "', '" + b.firstPay + "', '" + prod.idProd + "', '" + day + "', 1 )", (eror, rows, fildData) => {
                                            if (eror) {
                                                console.log(eror);
                                            }
                                        });
                                }
                            });
                    });
                } else {
                    mycon.execute("INSERT INTO  `sw_invoice` (   `date`, `userId`, `totalValue`, `productId`)" +
                        " VALUES	(   '" + day + "', '" + userID + "', '" + b.firstPay + "', '" + prod.idProd + "' )", (er, ro, fi) => {
                            if (!er) {
                                let invoiceID = ro.insertId;

                                let para = {
                                    invoice: invoiceID,
                                    uid: userID,
                                    parent: b.aPin,
                                    side: b.side,
                                    point: prod.prodPoint,
                                    intro: b.introUid
                                }
                                this.addOneToTree(para, res, next);
                                userController.sendLoginInformation(userID);
                                mycon.execute("INSERT INTO `sw_installment` ( `userId`, `invoiceId`, `paidAmount`, `prodId`, `paidDate`, `status` )" +
                                    " VALUES	( '" + userID + "', '" + invoiceID + "', '" + b.firstPay + "', '" + prod.idProd + "', '" + day + "', 1 )", (eror, rows, fildData) => {
                                        if (eror) {
                                            console.log(eror);
                                        }
                                    });
                            }
                        });
                }
            }
        });
    } catch (error) {
        console.log(error)
    }
}


exports.newNode = (req, res, next) => {


    // introUid: '1000',
    // aPin: '16',
    // aPinUid: 1000,
    // side: 'A',
    // type: 'other',
    // product: 1
    //  let b = req.body;


    try {

        let b = req.body;
        let userID = 0;
        let cusID = 0;
        var day = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
        if (b.type === 'other') {
            mycon.execute("INSERT INTO `user` (  `status`, `dateTime`, `utypeId` ) VALUES (0, '" + day + "', 4 )", (ee, rr, ff) => {
                if (!ee) {
                    userID = rr.insertId;
                    b.vlaues.forEach(e => {
                        this.setUserVal({ uid: userID, key: e.idUserKey, val: e.val });
                    });
                    mycon.execute("SELECT sw_prod.idProd,sw_prod.prodName,sw_prod.prodImage,sw_prod.prodPrice,sw_prod.prodPoint,sw_prod.prodOther,sw_prod.prodStatus FROM sw_prod WHERE sw_prod.idProd=" + b.product, (eee, rrr, fff) => {
                        if (!eee) {
                            let prod = rrr[0];

                            this.saveCustomer(b.purchaser, prod.idProd, userID, ddd => {
                                // console.log("++++++++++++");
                                // console.log(ddd);
                                // console.log("++++++++++++++");

                                mycon.execute("INSERT INTO  `sw_invoice` (   `date`, `userId`, `totalValue`, `productId`, `cusid` )" +
                                    " VALUES	(   '" + day + "', '" + userID + "', '" + b.firstPay + "', '" + prod.idProd + "','" + ddd.insertId + "' )", (er, ro, fi) => {
                                        if (!er) {
                                            let invoiceID = ro.insertId;
                                            let para = {
                                                uid: userID,
                                                parent: b.aPin,
                                                side: b.side,
                                                point: prod.prodPoint,
                                                intro: b.introUid,
                                                invoice: invoiceID,
                                            }

                                            // console.log("000000000000000000000000000000000000000");
                                            // console.log(para);
                                            // console.log("000000000000000000000000000000000000000");

                                            this.addToTree(para, res, next);

                                            userController.sendLoginInformation(userID);

                                            // console.log("================================================== " + userID + " for sms")

                                            mycon.execute("INSERT INTO `sw_installment` ( `userId`, `invoiceId`, `paidAmount`, `prodId`, `paidDate`, `status` )" +
                                                " VALUES	( '" + userID + "', '" + invoiceID + "', '" + b.firstPay + "', '" + prod.idProd + "', '" + day + "', 1 )", (eror, rows, fildData) => {
                                                    if (eror) {
                                                        console.log(eror);
                                                    }
                                                });
                                        }
                                    });

                            });


                        } else { console.log(eee); }
                    });
                } else {
                    console.log(ee);
                }
            });

        } else {
            mycon.execute("INSERT INTO `user` (  `status`, `dateTime`, `utypeId` ) VALUES (0, '" + day + "', 4 )", (ee, rr, ff) => {
                if (!ee) {
                    userID = rr.insertId;
                    b.vlaues.forEach(e => {
                        this.setUserVal({ uid: userID, key: e.idUserKey, val: e.val });
                    });
                    mycon.execute("SELECT sw_prod.idProd,sw_prod.prodName,sw_prod.prodImage,sw_prod.prodPrice,sw_prod.prodPoint,sw_prod.prodOther,sw_prod.prodStatus FROM sw_prod WHERE sw_prod.idProd=" + b.product, (eee, rrr, fff) => {
                        if (!eee) {
                            let prod = rrr[0];
                            mycon.execute("INSERT INTO  `sw_invoice` (   `date`, `userId`, `totalValue`, `productId`)" +
                                " VALUES	(   '" + day + "', '" + userID + "', '" + b.firstPay + "', '" + prod.idProd + "' )", (er, ro, fi) => {
                                    if (!er) {
                                        let invoiceID = ro.insertId;

                                        let para = {
                                            invoice: invoiceID,
                                            uid: userID,
                                            parent: b.aPin,
                                            side: b.side,
                                            point: prod.prodPoint,
                                            intro: b.introUid
                                        }
                                        this.addToTree(para, res, next);
                                        userController.sendLoginInformation(userID);
                                        mycon.execute("INSERT INTO `sw_installment` ( `userId`, `invoiceId`, `paidAmount`, `prodId`, `paidDate`, `status` )" +
                                            " VALUES	( '" + userID + "', '" + invoiceID + "', '" + b.firstPay + "', '" + prod.idProd + "', '" + day + "', 1 )", (eror, rows, fildData) => {
                                                if (eror) {
                                                    console.log(eror);
                                                }
                                            });
                                    }
                                });
                        }
                    });
                } else {
                    console.log(ee);
                }
            });
        }
    } catch (error) {
        console.log(error);
    }
}


exports.setUserVal = (parm) => {
    let q = "INSERT INTO  `uservalue`(  `userId`, `keyId`, `value`, `valueStatus`) VALUES (  " + parm.uid + ",  " + parm.key + " , '" + this.realEscapeString(parm.val) + "', 1)";
    mycon.execute(q, (er, ro, fi) => {
        if (!er) {
            return;
        } else {
            console.log(er)
            return;
        }
    });
}


exports.getDownTree = (req, res, next) => {
    try {
        let arr = [];
        function getNode(id) {
            mycon.execute("SELECT sw_tree.swTreeId AS id,sw_tree.parentId AS pid,sw_tree.A,sw_tree.B,sw_tree.APoint,sw_tree.BPoint,sw_tree.userName AS img,`user`.email,uservalue.`value` AS `name`,sw_tree.commitionId AS title,sw_tree.userId FROM sw_tree INNER JOIN `user` ON `user`.idUser=sw_tree.userId LEFT JOIN uservalue ON uservalue.userId=`user`.idUser WHERE uservalue.keyId=2 AND sw_tree.swTreeId=" + id,
                (error, rows, fildData) => {
                    if (!error) {
                        let nod = rows[0];
                        // console.log('-----------------------------------------------------');
                        // console.log(nod);
                        // console.log('------------------------------------------------------');       
                        if (nod) {
                            arr.push(nod);
                            if (nod.A && nod.A > 0) {
                                getNode(nod.A);
                            }

                            if (nod.B && nod.B > 0) {
                                getNode(nod.B);
                            }
                        }
                    }
                });
        }

        getNode(req.body.id);

        setTimeout(() => {
            // console.log(arr);
            res.send(arr);
        }, 2000);

    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}




exports.getDownTreeLimited = (req, res, next) => {
    let parentId = 0;
    try {
        let arr = [];

        // console.log(req.body);

        if (req.body.type == 'true') {
            getNode(req.body.id);
            // console.log('true');
        } else {
            // console.log('false');
            if (req.body.id > 0) {
                mycon.execute("SELECT sw_tree.parentId FROM sw_tree WHERE sw_tree.swTreeId= " + req.body.id, (e, r, f) => {
                    if (!e) {
                        // console.log(r);
                        getNode(r[0].parentId);
                    }
                })
            } else {
                getNode(1);
            }

        }


        function pointSum(nod) {
            mycon.execute("SELECT sw_point.Side,Sum(sw_point.point) as point FROM sw_point WHERE sw_point.treeid='" + nod.id + "' AND sw_point.`status`='1' AND sw_point.Side='A' ", (e, r, f) => {
                if (!e) {
                    if (r[0].point != null)
                        nod.pointA = r[0].point;
                    mycon.execute("SELECT sw_point.Side,Sum(sw_point.point) as point FROM sw_point WHERE sw_point.treeid='" + nod.id + "' AND sw_point.`status`='1' AND sw_point.Side='B' ", (e, r, f) => {
                        if (!e) {
                            if (r[0].point != null)
                                nod.pointB = r[0].point;
                            arr.push(nod);
                        }
                    });
                }
            });

        }


        function getNode(id) {

            mycon.execute("SELECT sw_tree.swTreeId AS id,sw_tree.parentId AS parent,sw_tree.A,sw_tree.B,sw_tree.APoint,sw_tree.BPoint,sw_tree.userName AS img,`user`.email,uservalue.`value` AS `name`,sw_tree.commitionId AS title,sw_tree.userId FROM sw_tree INNER JOIN `user` ON `user`.idUser=sw_tree.userId LEFT JOIN uservalue ON uservalue.userId=`user`.idUser WHERE uservalue.keyId=2 AND sw_tree.swTreeId=" + id,
                (error, rows, fildData) => {
                    if (!error) {
                        var d = rows[0];
                        if (d) {
                            let nod = { id: d.id, name: d.name, side: '', pointA: d.APoint, pointB: d.BPoint, parent: 0, A: d.A, B: d.B, uid: d.userId, active: d.title };
                            parentId = nod.id;
                            pointSum(nod);
                            if (nod.A && nod.A > 0) {
                                mycon.execute("SELECT sw_tree.swTreeId AS id,sw_tree.parentId AS parent,sw_tree.A,sw_tree.B,sw_tree.APoint,sw_tree.BPoint,sw_tree.userName AS img,`user`.email,uservalue.`value` AS `name`,sw_tree.commitionId AS title,sw_tree.userId FROM sw_tree INNER JOIN `user` ON `user`.idUser=sw_tree.userId LEFT JOIN uservalue ON uservalue.userId=`user`.idUser WHERE uservalue.keyId=2 AND sw_tree.swTreeId=" + nod.A, (e, r, f) => {
                                    if (!e) {
                                        var d = r[0];
                                        if (d) {
                                            let no = { id: d.id, name: d.name, side: 'A', pointA: d.APoint, pointB: d.BPoint, parent: d.parent, A: d.A, B: d.B, uid: d.userId, active: d.title };
                                            pointSum(no);

                                            if (no.A && no.A > 0) {
                                                mycon.execute("SELECT sw_tree.swTreeId AS id,sw_tree.parentId AS parent,sw_tree.A,sw_tree.B,sw_tree.APoint,sw_tree.BPoint,sw_tree.userName AS img,`user`.email,uservalue.`value` AS `name`,sw_tree.commitionId AS title,sw_tree.userId FROM sw_tree INNER JOIN `user` ON `user`.idUser=sw_tree.userId LEFT JOIN uservalue ON uservalue.userId=`user`.idUser WHERE uservalue.keyId=2 AND sw_tree.swTreeId=" + no.A, (e, r, f) => {
                                                    if (!e) {
                                                        var d = r[0];
                                                        if (d) {
                                                            let n = { id: d.id, name: d.name, side: 'A', pointA: d.APoint, pointB: d.BPoint, parent: d.parent, A: d.A, B: d.B, uid: d.userId, active: d.title };
                                                            pointSum(n);

                                                            if (n.A && n.A > 0) {
                                                                mycon.execute("SELECT sw_tree.swTreeId AS id,sw_tree.parentId AS parent,sw_tree.A,sw_tree.B,sw_tree.APoint,sw_tree.BPoint,sw_tree.userName AS img,`user`.email,uservalue.`value` AS `name`,sw_tree.commitionId AS title,sw_tree.userId FROM sw_tree INNER JOIN `user` ON `user`.idUser=sw_tree.userId LEFT JOIN uservalue ON uservalue.userId=`user`.idUser WHERE uservalue.keyId=2 AND sw_tree.swTreeId=" + n.A, (e, r, f) => {
                                                                    if (!e) {
                                                                        var d = r[0];
                                                                        if (d) {
                                                                            let nn = { id: d.id, name: d.name, side: 'A', pointA: d.APoint, pointB: d.BPoint, parent: d.parent, A: d.A, B: d.B, uid: d.userId, active: d.title };
                                                                            pointSum(nn);
                                                                        }
                                                                    }
                                                                });
                                                            }

                                                            if (n.B && n.B > 0) {
                                                                mycon.execute("SELECT sw_tree.swTreeId AS id,sw_tree.parentId AS parent,sw_tree.A,sw_tree.B,sw_tree.APoint,sw_tree.BPoint,sw_tree.userName AS img,`user`.email,uservalue.`value` AS `name`,sw_tree.commitionId AS title,sw_tree.userId FROM sw_tree INNER JOIN `user` ON `user`.idUser=sw_tree.userId LEFT JOIN uservalue ON uservalue.userId=`user`.idUser WHERE uservalue.keyId=2 AND sw_tree.swTreeId=" + n.B, (e, r, f) => {
                                                                    if (!e) {
                                                                        var d = r[0];
                                                                        if (d) {
                                                                            let nn = { id: d.id, name: d.name, side: 'B', pointA: d.APoint, pointB: d.BPoint, parent: d.parent, A: d.A, B: d.B, uid: d.userId, active: d.title };
                                                                            pointSum(nn);
                                                                        }
                                                                    }
                                                                });
                                                            }

                                                        }
                                                    }
                                                });
                                            }

                                            if (no.B && no.B > 0) {
                                                mycon.execute("SELECT sw_tree.swTreeId AS id,sw_tree.parentId AS parent,sw_tree.A,sw_tree.B,sw_tree.APoint,sw_tree.BPoint,sw_tree.userName AS img,`user`.email,uservalue.`value` AS `name`,sw_tree.commitionId AS title,sw_tree.userId FROM sw_tree INNER JOIN `user` ON `user`.idUser=sw_tree.userId LEFT JOIN uservalue ON uservalue.userId=`user`.idUser WHERE uservalue.keyId=2 AND sw_tree.swTreeId=" + no.B, (e, r, f) => {
                                                    if (!e) {
                                                        var d = r[0];
                                                        if (d) {
                                                            let n = { id: d.id, name: d.name, side: 'B', pointA: d.APoint, pointB: d.BPoint, parent: d.parent, A: d.A, B: d.B, uid: d.userId, active: d.title };
                                                            pointSum(n);
                                                            if (n.A && n.A > 0) {
                                                                mycon.execute("SELECT sw_tree.swTreeId AS id,sw_tree.parentId AS parent,sw_tree.A,sw_tree.B,sw_tree.APoint,sw_tree.BPoint,sw_tree.userName AS img,`user`.email,uservalue.`value` AS `name`,sw_tree.commitionId AS title,sw_tree.userId FROM sw_tree INNER JOIN `user` ON `user`.idUser=sw_tree.userId LEFT JOIN uservalue ON uservalue.userId=`user`.idUser WHERE uservalue.keyId=2 AND sw_tree.swTreeId=" + n.A, (e, r, f) => {
                                                                    if (!e) {
                                                                        var d = r[0];
                                                                        if (d) {
                                                                            let nn = { id: d.id, name: d.name, side: 'A', pointA: d.APoint, pointB: d.BPoint, parent: d.parent, A: d.A, B: d.B, uid: d.userId, active: d.title };
                                                                            pointSum(nn);
                                                                        }
                                                                    }
                                                                });
                                                            }

                                                            if (n.B && n.B > 0) {
                                                                mycon.execute("SELECT sw_tree.swTreeId AS id,sw_tree.parentId AS parent,sw_tree.A,sw_tree.B,sw_tree.APoint,sw_tree.BPoint,sw_tree.userName AS img,`user`.email,uservalue.`value` AS `name`,sw_tree.commitionId AS title,sw_tree.userId FROM sw_tree INNER JOIN `user` ON `user`.idUser=sw_tree.userId LEFT JOIN uservalue ON uservalue.userId=`user`.idUser WHERE uservalue.keyId=2 AND sw_tree.swTreeId=" + n.B, (e, r, f) => {
                                                                    if (!e) {
                                                                        var d = r[0];
                                                                        if (d) {
                                                                            let nn = { id: d.id, name: d.name, side: 'B', pointA: d.APoint, pointB: d.BPoint, parent: d.parent, A: d.A, B: d.B, uid: d.userId, active: d.title };
                                                                            pointSum(nn);
                                                                        }
                                                                    }
                                                                });
                                                            }
                                                        }
                                                    }
                                                });
                                            }

                                        }
                                    }
                                });
                            }

                            if (nod.B && nod.B > 0) {
                                mycon.execute("SELECT sw_tree.swTreeId AS id,sw_tree.parentId AS parent,sw_tree.A,sw_tree.B,sw_tree.APoint,sw_tree.BPoint,sw_tree.userName AS img,`user`.email,uservalue.`value` AS `name`,sw_tree.commitionId AS title,sw_tree.userId FROM sw_tree INNER JOIN `user` ON `user`.idUser=sw_tree.userId LEFT JOIN uservalue ON uservalue.userId=`user`.idUser WHERE uservalue.keyId=2 AND sw_tree.swTreeId=" + nod.B, (e, r, f) => {
                                    if (!e) {
                                        var d = r[0];
                                        if (d) {
                                            let no = { id: d.id, name: d.name, side: 'B', pointA: d.APoint, pointB: d.BPoint, parent: d.parent, A: d.A, B: d.B, uid: d.userId, active: d.title };
                                            pointSum(no);

                                            if (no.A && no.A > 0) {
                                                mycon.execute("SELECT sw_tree.swTreeId AS id,sw_tree.parentId AS parent,sw_tree.A,sw_tree.B,sw_tree.APoint,sw_tree.BPoint,sw_tree.userName AS img,`user`.email,uservalue.`value` AS `name`,sw_tree.commitionId AS title,sw_tree.userId FROM sw_tree INNER JOIN `user` ON `user`.idUser=sw_tree.userId LEFT JOIN uservalue ON uservalue.userId=`user`.idUser WHERE uservalue.keyId=2 AND sw_tree.swTreeId=" + no.A, (e, r, f) => {
                                                    if (!e) {
                                                        var d = r[0];
                                                        if (d) {
                                                            let n = { id: d.id, name: d.name, side: 'A', pointA: d.APoint, pointB: d.BPoint, parent: d.parent, A: d.A, B: d.B, uid: d.userId, active: d.title };
                                                            pointSum(n);
                                                            if (n.A && n.A > 0) {
                                                                mycon.execute("SELECT sw_tree.swTreeId AS id,sw_tree.parentId AS parent,sw_tree.A,sw_tree.B,sw_tree.APoint,sw_tree.BPoint,sw_tree.userName AS img,`user`.email,uservalue.`value` AS `name`,sw_tree.commitionId AS title,sw_tree.userId FROM sw_tree INNER JOIN `user` ON `user`.idUser=sw_tree.userId LEFT JOIN uservalue ON uservalue.userId=`user`.idUser WHERE uservalue.keyId=2 AND sw_tree.swTreeId=" + n.A, (e, r, f) => {
                                                                    if (!e) {
                                                                        var d = r[0];
                                                                        if (d) {
                                                                            let nn = { id: d.id, name: d.name, side: 'A', pointA: d.APoint, pointB: d.BPoint, parent: d.parent, A: d.A, B: d.B, uid: d.userId, active: d.title };
                                                                            pointSum(nn);
                                                                        }
                                                                    }
                                                                });
                                                            }

                                                            if (n.B && n.B > 0) {
                                                                mycon.execute("SELECT sw_tree.swTreeId AS id,sw_tree.parentId AS parent,sw_tree.A,sw_tree.B,sw_tree.APoint,sw_tree.BPoint,sw_tree.userName AS img,`user`.email,uservalue.`value` AS `name`,sw_tree.commitionId AS title,sw_tree.userId FROM sw_tree INNER JOIN `user` ON `user`.idUser=sw_tree.userId LEFT JOIN uservalue ON uservalue.userId=`user`.idUser WHERE uservalue.keyId=2 AND sw_tree.swTreeId=" + n.B, (e, r, f) => {
                                                                    if (!e) {
                                                                        var d = r[0];
                                                                        if (d) {
                                                                            let nn = { id: d.id, name: d.name, side: 'B', pointA: d.APoint, pointB: d.BPoint, parent: d.parent, A: d.A, B: d.B, uid: d.userId, active: d.title };
                                                                            pointSum(nn);
                                                                        }
                                                                    }
                                                                });
                                                            }
                                                        }
                                                    }
                                                });
                                            }

                                            if (no.B && no.B > 0) {
                                                mycon.execute("SELECT sw_tree.swTreeId AS id,sw_tree.parentId AS parent,sw_tree.A,sw_tree.B,sw_tree.APoint,sw_tree.BPoint,sw_tree.userName AS img,`user`.email,uservalue.`value` AS `name`,sw_tree.commitionId AS title,sw_tree.userId FROM sw_tree INNER JOIN `user` ON `user`.idUser=sw_tree.userId LEFT JOIN uservalue ON uservalue.userId=`user`.idUser WHERE uservalue.keyId=2 AND sw_tree.swTreeId=" + no.B, (e, r, f) => {
                                                    if (!e) {
                                                        var d = r[0];
                                                        if (d) {
                                                            let n = { id: d.id, name: d.name, side: 'B', pointA: d.APoint, pointB: d.BPoint, parent: d.parent, A: d.A, B: d.B, uid: d.userId, active: d.title };
                                                            pointSum(n);
                                                            if (n.A && n.A > 0) {
                                                                mycon.execute("SELECT sw_tree.swTreeId AS id,sw_tree.parentId AS parent,sw_tree.A,sw_tree.B,sw_tree.APoint,sw_tree.BPoint,sw_tree.userName AS img,`user`.email,uservalue.`value` AS `name`,sw_tree.commitionId AS title,sw_tree.userId FROM sw_tree INNER JOIN `user` ON `user`.idUser=sw_tree.userId LEFT JOIN uservalue ON uservalue.userId=`user`.idUser WHERE uservalue.keyId=2 AND sw_tree.swTreeId=" + n.A, (e, r, f) => {
                                                                    if (!e) {
                                                                        var d = r[0];
                                                                        if (d) {
                                                                            let nn = { id: d.id, name: d.name, side: 'A', pointA: d.APoint, pointB: d.BPoint, parent: d.parent, A: d.A, B: d.B, uid: d.userId, active: d.title };
                                                                            pointSum(nn);
                                                                        }
                                                                    }
                                                                });
                                                            }

                                                            if (n.B && n.B > 0) {
                                                                mycon.execute("SELECT sw_tree.swTreeId AS id,sw_tree.parentId AS parent,sw_tree.A,sw_tree.B,sw_tree.APoint,sw_tree.BPoint,sw_tree.userName AS img,`user`.email,uservalue.`value` AS `name`,sw_tree.commitionId AS title,sw_tree.userId FROM sw_tree INNER JOIN `user` ON `user`.idUser=sw_tree.userId LEFT JOIN uservalue ON uservalue.userId=`user`.idUser WHERE uservalue.keyId=2 AND sw_tree.swTreeId=" + n.B, (e, r, f) => {
                                                                    if (!e) {
                                                                        var d = r[0];
                                                                        if (d) {
                                                                            let nn = { id: d.id, name: d.name, side: 'B', pointA: d.APoint, pointB: d.BPoint, parent: d.parent, A: d.A, B: d.B, uid: d.userId, active: d.title };
                                                                            pointSum(nn);
                                                                        }
                                                                    }
                                                                });
                                                            }
                                                        }
                                                    }
                                                });
                                            }

                                        }
                                    }
                                });
                            }
                        }
                    }
                });
        }



        setTimeout(() => {
            //  console.log(arr);
            res.send(arr);
        }, 500);

    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}





exports.addToTree = (param, res, next) => {
    try {
        // var param = req.body;
        var day = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");

        // {
        //     "uid": 1000,
        //     "parent": 13,
        //     "side": "A",
        //     "point": 1,
        //     "intro": 12,
        //     "introCom": 14,
        // }

        mycon.execute("SELECT sw_commition.idCommition,sw_commition.register_date,sw_commition.userId,sw_commition.introducerid,sw_commition.introducerCommitionId,sw_commition.`status` FROM sw_commition WHERE sw_commition.userId='" + param.intro + "' ORDER BY sw_commition.idCommition ASC", (ee, rr, ff) => {
            if (!ee) {
                let introCom = rr[0].idCommition;
                mycon.execute("INSERT INTO `sw_commition`(`register_date`, `userId`, `introducerid`, `introducerCommitionId`, `status`) " +
                    " VALUES ('" + day + "', " + param.uid + ", " + param.intro + ", " + introCom + ", 1)", (e, r, f) => {
                        if (!e) {
                            let comId = r.insertId;
                            mycon.execute("INSERT INTO  `sw_tree` (  `parentId`, `A`, `B`, `userId`, `commitionId`, `APoint`, `BPoint`, `layar`, `status`, `userName`, `other1`, `other2` ) " +
                                "  VALUES	( " + param.parent + ", NULL, NULL, " + param.uid + ", " + comId + ", 0, 0, 0, 1, '../../../assets/img/profile.png', 0, '0' )", (er, ro, fi) => {
                                    if (!er) {
                                        let treeId = ro.insertId;

                                        // console.log('---------');
                                        // console.log(treeId);
                                        // console.log('---------');


                                        mycon.execute("UPDATE `sw_invoice` SET `pin`='" + treeId + "' WHERE `idInvoice`= " + param.invoice, (ee, rr, ff) => {
                                            if (ee) {
                                                console.log(ee);
                                            }
                                        });

                                        mycon.execute("UPDATE `sw_installment` SET `pin`='" + treeId + "' WHERE `invoiceId`=" + param.invoice, (ee, rr, ff) => {
                                            if (ee) {
                                                console.log(ee);
                                            }
                                        })



                                        if (param.side === 'A') {
                                            mycon.execute("UPDATE `sw_tree` SET `A`='" + treeId + "' WHERE `swTreeId`=" + param.parent, (errr, rooo, fiii) => {
                                                if (!errr) {
                                                } else {
                                                    console.log(errr);
                                                }
                                            });
                                        }

                                        if (param.side === 'B') {
                                            mycon.execute("UPDATE `sw_tree` SET `B`='" + treeId + "' WHERE `swTreeId`=" + param.parent, (errr, rooo, fiii) => {
                                                if (!errr) {
                                                } else {
                                                    console.log(errr);
                                                }
                                            });
                                        }
                                        let idA = null;
                                        let idB = null;

                                        mycon.execute("INSERT INTO `sw_tree` ( `parentId`, `A`, `B`, `userId`, `commitionId`, `APoint`, `BPoint`, `layar`, `status`, `userName`, `other1`, `other2` )"
                                            + "  VALUES ( " + treeId + ", NULL, NULL, " + param.uid + ", NULL, 0, 0, 0, 0, '../../../assets/img/x-button.png', 0, '0' )", (err, roo, fii) => {
                                                if (!err) {
                                                    idA = roo.insertId;
                                                    mycon.execute("UPDATE `sw_tree` SET `A`='" + idA + "' WHERE `swTreeId`=" + treeId, (errr, rooo, fiii) => {
                                                        if (!errr) {
                                                            mycon.execute("INSERT INTO `sw_tree` ( `parentId`, `A`, `B`, `userId`, `commitionId`, `APoint`, `BPoint`, `layar`, `status`, `userName`, `other1`, `other2` )"
                                                                + "  VALUES ( " + treeId + ", NULL, NULL, " + param.uid + ", NULL, 0, 0, 0, 0, '../../../assets/img/x-button.png', 0, '0' )", (err, roo, fii) => {
                                                                    if (!err) {
                                                                        idB = roo.insertId;
                                                                        mycon.execute("UPDATE `sw_tree` SET `B`='" + idB + "' WHERE `swTreeId`=" + treeId, (errr, rooo, fiii) => {
                                                                            if (!errr) {
                                                                                let object = { "idMain": treeId, "A": idA, "B": idB, extra: param }
                                                                                this.addPoint({ tid: treeId, obj: object, invoice: param.invoice }, res, next);
                                                                            } else {
                                                                                console.log(errr);
                                                                            }
                                                                        });
                                                                    } else {
                                                                        console.log(err);
                                                                    }
                                                                }
                                                            );
                                                        } else {
                                                            console.log(errr);
                                                        }
                                                    });
                                                } else {
                                                    console.log(err);
                                                }
                                            }
                                        );

                                    } else {
                                        console.log(er);
                                    }
                                });
                        } else { console.log(e) }
                    });
            }
        });

    } catch (error) {
        console.log(error);
        //  res.status(500).send(error);
    }
}




exports.addOneToTree = (param, res, next) => {
    try {
        // var param = req.body;
        var day = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");

        // {
        //     "uid": 1000,
        //     "parent": 13,
        //     "side": "A",
        //     "point": 1,
        //     "intro": 12,
        //     "introCom": 14,
        // }

        mycon.execute("SELECT sw_commition.idCommition,sw_commition.register_date,sw_commition.userId,sw_commition.introducerid,sw_commition.introducerCommitionId,sw_commition.`status` FROM sw_commition WHERE sw_commition.userId='" + param.intro + "' ORDER BY sw_commition.idCommition ASC", (ee, rr, ff) => {
            if (!ee) {
                let introCom = rr[0].idCommition;
                mycon.execute("INSERT INTO `sw_commition`(`register_date`, `userId`, `introducerid`, `introducerCommitionId`, `status`) " +
                    " VALUES ('" + day + "', " + param.uid + ", " + param.intro + ", " + introCom + ", 1)", (e, r, f) => {
                        if (!e) {
                            let comId = r.insertId;
                            mycon.execute("INSERT INTO  `sw_tree` (  `parentId`, `A`, `B`, `userId`, `commitionId`, `APoint`, `BPoint`, `layar`, `status`, `userName`, `other1`, `other2` ) " +
                                "  VALUES	( " + param.parent + ", NULL, NULL, " + param.uid + ", " + comId + ", 0, 0, 0, 1, '../../../assets/img/profile.png', 0, '0' )", (er, ro, fi) => {
                                    if (!er) {
                                        let treeId = ro.insertId;

                                        // console.log('---------');
                                        // console.log(treeId);
                                        // console.log('---------');


                                        mycon.execute("UPDATE `sw_invoice` SET `pin`='" + treeId + "' WHERE `idInvoice`= " + param.invoice, (ee, rr, ff) => {
                                            if (ee) {
                                                console.log(ee);
                                            }
                                        });

                                        mycon.execute("UPDATE `sw_installment` SET `pin`='" + treeId + "' WHERE `invoiceId`=" + param.invoice, (ee, rr, ff) => {
                                            if (ee) {
                                                console.log(ee);
                                            }
                                        })

                                        if (param.side === 'A') {
                                            mycon.execute("UPDATE `sw_tree` SET `A`='" + treeId + "' WHERE `swTreeId`=" + param.parent, (errr, rooo, fiii) => {
                                                if (!errr) {
                                                } else {
                                                    console.log(errr);
                                                }
                                            });
                                        }
                                        if (param.side === 'B') {
                                            mycon.execute("UPDATE `sw_tree` SET `B`='" + treeId + "' WHERE `swTreeId`=" + param.parent, (errr, rooo, fiii) => {
                                                if (!errr) {
                                                } else {
                                                    console.log(errr);
                                                }
                                            });
                                        }

                                        let idA = null;
                                        let idB = null;

                                        let object = { "idMain": treeId, "A": idA, "B": idB, extra: param }
                                        this.addPoint({ tid: treeId, obj: object, invoice: param.invoice }, res, next);



                                    } else {
                                        console.log(er);
                                    }
                                });
                        } else { console.log(e) }
                    });
            }
        });

    } catch (error) {
        console.log(error);
        //  res.status(500).send(error);
    }
}






exports.addPoint = (param, res, next) => {

    // console.log(param);

    let invoiceID = param.invoice;

    try {

        function calPoint(nod) {
            let aPoint = 0;
            let bPoint = 0;

            mycon.execute("SELECT sw_point.userId,sw_point.commitionId,sw_point.Side,sum(sw_point.point) AS sum,sw_point.`status`,sw_point.treeid FROM sw_point WHERE sw_point.Side='A' AND sw_point.treeid='" + nod.swTreeId + "' AND sw_point.`status`='1'", (e, r, f) => {
                if (!e) {
                    aPoint = r[0].sum;

                    mycon.execute("UPDATE `sw_tree` SET `APoint`=" + aPoint + " WHERE `swTreeId`= " + nod.swTreeId, (ee, rr, ff) => {
                        if (ee) {
                            console.log(ee);
                        }
                    })

                    mycon.execute("SELECT sw_point.userId,sw_point.commitionId,sw_point.Side,sum(sw_point.point) AS sum,sw_point.`status`,sw_point.treeid FROM sw_point WHERE sw_point.Side='B' AND sw_point.treeid='" + nod.swTreeId + "' AND sw_point.`status`='1'", (e, rr, f) => {
                        if (!e) {
                            bPoint = rr[0].sum;
                            mycon.execute("UPDATE `sw_tree` SET `BPoint`=" + bPoint + " WHERE `swTreeId`= " + nod.swTreeId, (eee, rr, ff) => {
                                if (eee) {
                                    console.log(eee);
                                }
                            })

                            console.log("Node   -  " + nod.swTreeId + "   A Point- " + aPoint + "       B Point- " + bPoint);
                        }
                    });
                }
            });
        }


        function pointLoop(nodeId, myId) {
            mycon.execute("SELECT sw_tree.swTreeId,sw_tree.parentId,sw_tree.A,sw_tree.B,sw_tree.userId,sw_tree.commitionId,sw_tree.APoint,sw_tree.BPoint,sw_tree.layar,sw_tree.`status`,sw_tree.userName,sw_tree.other1,sw_tree.other2 FROM sw_tree WHERE sw_tree.swTreeId=" + nodeId, (e, r, f) => {
                if (!e) {
                    let nod = r[0];
                    if (nod) {
                        // console.log(nod);
                        if (nod.A && nod.A == myId) {
                            if (nod.commitionId && nod.commitionId > 0) {
                                // console.log('A point');
                                mycon.execute("INSERT INTO  `sw_point`(  `userId`, `commitionId`, `invoiceId`, `Side`, `point`, `status`, `treeid`) VALUES (  '" + nod.userId + "', '" + nod.commitionId + "', '" + invoiceID + "', 'A', 1, 1,'" + nod.swTreeId + "')", (ee, rr, ff) => {
                                    if (ee) {
                                        console.log(ee);
                                        //   calPoint(nod)
                                    }
                                })
                            } else {
                                // console.log("not active -------------------------" + nod.swTreeId)
                            }
                        }
                        if (nod.B && nod.B == myId) {
                            if (nod.commitionId && nod.commitionId > 0) {
                                // console.log('B point');
                                mycon.execute("INSERT INTO  `sw_point`(  `userId`, `commitionId`, `invoiceId`, `Side`, `point`, `status`, `treeid`) VALUES (  '" + nod.userId + "', '" + nod.commitionId + "', '" + invoiceID + "', 'B', 1, 1,'" + nod.swTreeId + "')", (ee, rr, ff) => {
                                    if (ee) {
                                        console.log(ee);
                                        //    calPoint(nod);
                                    }
                                })

                            } else {
                                //  console.log("not active -------------------------" + nod.swTreeId)
                            }

                        }
                        // calPoint(nod);
                        pointLoop(nod.parentId, nod.swTreeId);
                    }
                }
            });
        }

        mycon.execute("SELECT sw_tree.swTreeId,sw_tree.parentId,sw_tree.A,sw_tree.B,sw_tree.userId,sw_tree.commitionId,sw_tree.APoint,sw_tree.BPoint,sw_tree.layar,sw_tree.`status`,sw_tree.userName,sw_tree.other1,sw_tree.other2 FROM sw_tree WHERE sw_tree.swTreeId=  " + param.tid,
            (e, r, f) => {
                if (!e) {
                    // console.log(r[0]);
                    pointLoop(r[0].parentId, param.tid);
                }
            }
        )


        res.send(param.obj);

    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}




exports.canAdd = (req, res, next) => {
    try {
        var param = req.body;
        // console.log('---------');
        // console.log(param);
        // console.log('---------');
        mycon.execute("SELECT sw_tree.swTreeId,sw_tree.parentId,sw_tree.A,sw_tree.B,sw_tree.userId,sw_tree.commitionId FROM sw_tree WHERE sw_tree.swTreeId=" + req.body.treeId,
            (er, ro, ne) => {
                let ob = {
                    sidA: true,
                    sidB: true,
                    userId: 0,
                    treeId: 0,

                }
                if (!er) {
                    // console.log('Data');
                    let r = ro[0];
                    if (r) {
                        ob.userId = r.userId;
                        ob.treeId = r.swTreeId;

                        if (r) {
                            // console.log('Data1');
                            if (r.A && r.A > 0) {

                                ob.sidA = false;
                            } else {

                            }
                            if (r.B && r.B > 0) {

                                ob.sidB = false;
                            } else {

                            }
                            res.send(ob);
                        } else {
                            ob.sidA = false;
                            ob.sidB = false;
                            res.send(ob);
                        }
                    } else {
                        ob.sidA = false;
                        ob.sidB = false;
                        res.send(ob);
                    }
                } else {
                    // console.log(er);
                    ob.sidA = false;
                    ob.sidB = false;
                    res.send(ob);
                }
            });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}


exports.getCurrent = (req, res, next) => {
    try {

        mycon.execute("SELECT sw_tree.swTreeId,sw_tree.parentId,sw_tree.A,sw_tree.B,sw_tree.userId,sw_tree.commitionId,sw_tree.APoint,sw_tree.BPoint,sw_tree.layar,sw_tree.`status`,sw_tree.userName,sw_tree.other1,sw_tree.other2 FROM sw_tree WHERE sw_tree.userId= " + req.body.uid, (e, r, f) => {
            if (!e) {
                res.send(r);
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

exports.getIntroduser = (req, res, next) => {
    try {

        mycon.execute("SELECT uservalue.`value`,sw_commition.idCommition,sw_commition.introducerid FROM uservalue INNER JOIN sw_commition ON sw_commition.introducerid=uservalue.userId WHERE uservalue.keyId=2 AND sw_commition.idCommition= " + req.body.comid, (e, r, f) => {
            if (!e) {
                res.send(r);
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

exports.updateIntroduser = (req, res, next) => {
    try {

        mycon.execute("SELECT sw_commition.idCommition,sw_commition.register_date,sw_commition.userId,sw_commition.introducerid,sw_commition.introducerCommitionId,sw_commition.`status` FROM sw_commition WHERE sw_commition.userId='" + req.body.newIntro + "' ORDER BY sw_commition.idCommition ASC", (e, r, f) => {
            if (!e) {
                if (r[0]) {
                    let incom = r[0].idCommition;
                    console.log(incom);
                    mycon.execute("UPDATE `sw_commition` SET `introducerid`='" + req.body.newIntro + "',`introducerCommitionId`='" + incom + "' WHERE `idCommition`='" + req.body.comid + "'", (ee, rr, ff) => {
                        res.send(rr);
                    });
                } else {
                    res.status(401).send({ "ok": "Not Found" });
                }
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}


exports.getCurrentPoint = (req, res, next) => {
    try {
        let side = req.body.side;
        let tid = req.body.tid;
        let status = req.body.status;
        mycon.execute("SELECT sw_point.Side,Sum(sw_point.point) as point FROM sw_point WHERE sw_point.treeid='" + tid + "' AND sw_point.`status`='" + status + "' AND sw_point.Side='" + side + "' ", (e, r, f) => {
            if (!e) {
                res.send(r[0]);
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}






