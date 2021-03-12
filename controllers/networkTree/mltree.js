const mycon = require('../../util/conn');
const userController = require('../userControllers/user');
const jwt = require('jsonwebtoken');
const bcript = require('bcrypt');
var dateFormat = require('dateformat');
const { use } = require('../../routers');


exports.realEscapeString = (str) => {
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
        switch (char) {
            case "\0": ෆෆ
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



exports.register = (req, res, next) => {
    try {
        var day = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
        var val = Math.floor(1000 + Math.random() * 9000);
        var q = "SELECT `user`.idUser FROM `user` WHERE `user`.email='" + req.body.email + "'";
        var qu = "SELECT tree.idTree, tree.parent, tree.layer, tree.userId, tree.`status`, tree.created, tree.other1, tree.other2, tree.other3, tree.string1, tree.string2, tree.string3 FROM tree WHERE tree.idTree = " + req.body.ref;

        mycon.execute(qu, (ee, rr, ff) => {
            if (!ee) {
                if (rr.length > 0) {
                    mycon.execute(q, (e, r, f) => {
                        if (!e) {
                            if (r.length > 0) {
                                return res.status(401).json({ message: 'This Email Address Alrady Exsist Please Login Or Register With Other Email' });
                            } else {
                                bcript.hash(req.body.pword, 10, (err, hash) => {
                                    if (err) {
                                        return status(500).json({ error: err });
                                    } else {
                                        console.log(hash);
                                        var qq = "INSERT INTO  `user`(  `email`, `pword`, `mobileno`, `authcode`, `status`, `dateTime`, `utypeId`)  VALUES ( '" + this.realEscapeString(req.body.email) + "', '" + hash + "', '" + this.realEscapeString(req.body.mobile) + "', '" + val + "', '0', '" + day + "', 2)";
                                        mycon.execute(qq, (ee, rr, ff) => {

                                            if (!ee) {
                                                userID = rr.insertId;
                                                res.send({ uid: rr.insertId, email: req.body.email });

                                                req.body.uid = userID;

                                                this.addToTree(req.body);

                                                let q = "INSERT INTO  `uservalue`(  `userId`, `keyId`, `value`, `valueStatus`) VALUES (  " + userID + ",1, '', 1)";
                                                mycon.execute(q, (er, ro, fi) => {
                                                    if (!er) {
                                                        //  console.log(ro);
                                                    } else {
                                                        console.log(er)
                                                    }
                                                });


                                                let qq = "INSERT INTO  `uservalue`(  `userId`, `keyId`, `value`, `valueStatus`) VALUES (  " + userID + ",2, '" + this.realEscapeString(req.body.name) + "', 1)";
                                                mycon.execute(qq, (er, ro, fi) => {
                                                    if (!er) {
                                                        //  console.log(ro);
                                                    } else {
                                                        console.log(er)
                                                    }
                                                });

                                                let qqq = "INSERT INTO  `uservalue`(  `userId`, `keyId`, `value`, `valueStatus`) VALUES (  " + userID + ",22, '" + this.realEscapeString(req.body.email) + "', 1)";
                                                mycon.execute(qqq, (er, ro, fi) => {
                                                    if (!er) {
                                                        //  console.log(ro);
                                                    } else {
                                                        console.log(er)
                                                    }
                                                });


                                                for (let i = 3; i < 23; i++) {
                                                    let q = "INSERT INTO  `uservalue`(  `userId`, `keyId`, `value`, `valueStatus`) VALUES (  " + userID + ", " + i + ", '', 1)";
                                                    mycon.execute(q, (er, ro, fi) => {
                                                        if (!er) {
                                                            //  console.log(ro);
                                                        } else {
                                                            console.log(er)
                                                        }
                                                    });
                                                }


                                            } else {
                                                console.log(ee);
                                                return status(500).json({ error: ee });
                                            }
                                        });
                                    }
                                });
                            }
                        } else {
                            console.log(e);
                            res.status(500).send(error);
                        }
                    });
                } else {
                    res.send({ "message": "Referance Number is Wrong" });
                }
            } else {
                console.log(ee);
                return res.send(401).json({ "message": "Referance Number is Wrong" });
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}


exports.addToTree = (param) => {
    try {
        console.log(param);
        var day = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
        var q = "SELECT tree.idTree, tree.parent, tree.layer, tree.userId, tree.`status`, tree.created, tree.other1, tree.other2, tree.other3, tree.string1, tree.string2, tree.string3 FROM tree WHERE tree.idTree = " + param.ref;
        mycon.execute(q, (e, r, f) => {
            if (!e) {
                console.log(r);
                let ref = r[0];
                let layer = ref.layer + 1;

                mycon.execute("INSERT INTO `tree` ( `parent`, `layer`, `userId`, `status`, `created`, `other1`, `other2`, `other3`, `string1`, `string2`, `string3` )"
                    + " VALUES	( " + param.ref + ", " + layer + ", " + param.uid + ", 0, '" + day + "', NULL, NULL, NULL, NULL, NULL, NULL )", (ee, rr, ff) => {
                        if (!ee) {
                            console.log(rr);
                            return;
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
        return res.status(500).send(error);
    }
}

let array = [];
let x = 0;
exports.getTree = (req, res, next) => {
    try {
        array = [];
        let q = "SELECT tree.idTree AS id,tree.parent AS pid, 	tree.idTree AS title, tree.layer,tree.userId,tree.other1,tree.`status`,`user`.email,uservalue.`value` AS `name` FROM tree INNER JOIN `user` ON `user`.idUser=tree.userId INNER JOIN uservalue ON uservalue.userId=`user`.idUser WHERE uservalue.keyId=2;";
        mycon.execute(q, (e, r, f) => {
            if (!e) {
                res.send(r);
            } else {
                console.log(e)
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}


exports.reCall = (parent) => {
    try {

        let q = "SELECT tree.idTree AS id,tree.parent AS pid,tree.layer,tree.userId,tree.other1,tree.`status`,`user`.email,uservalue.`value` AS NAME FROM tree INNER JOIN `user` ON `user`.idUser=tree.userId INNER JOIN uservalue ON uservalue.userId=`user`.idUser WHERE uservalue.keyId=2 AND tree.idTree=" + parent;
        mycon.execute(q, (e, r, f) => {
            if (!e) {
                array.forEach(ref => {

                    let obj = {
                        id: ref.id,
                        pid: ref.pid,
                        layer: ref.layer,
                        userId: ref.userId,
                        other1: ref.other1,
                        status: ref.status,
                        email: ref.email,
                        title: ref.NAME
                    };
                    array.push(obj);

                });

                console.log(array);

                for (i = x; i <= array.length; i++) {
                    let ob = array[i];
                    console.log(ob);
                    // this.reCall(ob.id);
                };
                x = array.length;

            } else {
                console.log(e);
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}


exports.getIncomeByUser = (req, res, next) => {
    try {

        let q = "SELECT ml_commitions.idml_commitions,ml_commitions.userid,ml_commitions.treeid,ml_commitions.addid,ml_commitions.amount,ml_commitions.`level`,ml_commitions.`status`,ml_commitions.added,ml_commitions.withdrawed,ml_commitions.withdrawid FROM ml_commitions WHERE ml_commitions.userid='" + req.body.uid + "' AND STATUS=1";
        mycon.execute(q, (e, r, f) => {
            if (!e) {
                res.send(r);
            } else {
                console.log(e)
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

exports.getIncomeAllUsers = (req, res, next) => {
    try {

        let q = "SELECT ml_commitions.idml_commitions,ml_commitions.userid,ml_commitions.treeid,ml_commitions.addid,Sum(ml_commitions.amount) as tot,ml_commitions.`level`,ml_commitions.`status`,ml_commitions.withdrawed,ml_commitions.withdrawid,`user`.email,uservalue.`value` FROM ml_commitions INNER JOIN `user` ON `user`.idUser=ml_commitions.userid INNER JOIN uservalue ON uservalue.userId=`user`.idUser WHERE ml_commitions.`status`=1 AND uservalue.keyId=2 GROUP BY ml_commitions.userid";
        mycon.execute(q, (e, r, f) => {
            if (!e) {
                res.send(r);
            } else {
                console.log(e)
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}


exports.findRef = (req, res, next) => {
    try {

        let q = "SELECT tree.idTree,`user`.idUser,uservalue.`value` FROM tree INNER JOIN `user` ON `user`.idUser=tree.userId INNER JOIN uservalue ON uservalue.userId=`user`.idUser WHERE tree.idTree='" + req.body.ref + "' AND uservalue.keyId=2";
        mycon.execute(q, (e, r, f) => {
            if (!e) {
                res.send(r);
            } else {
                console.log(e)
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

exports.getTreeIdByUser = (req, res, next) => {
    try {

        let q = "SELECT tree.idTree FROM tree WHERE tree.userId=" + req.body.uid;
        mycon.execute(q, (e, r, f) => {
            if (!e) {
                res.send(r);
            } else {
                console.log(e)
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}


