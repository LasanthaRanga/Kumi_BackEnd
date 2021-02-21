const mycon = require('../../util/conn');


// getAllPrivilages () - > {all privilages}


// getPrivilagesByUserType (utypeId) - > {all privilages filtered by usertype}
exports.getPrivilagesByUserType = (req, res, next) => {
    try {
        mycon.execute("SELECT privilage.idPrivilage,privilage.icon,privilage.link,privilage.`name`,privilage.`int`,privilage.string,privilage.other,privilage.`status` FROM privilage INNER JOIN usertypehasprivilages ON usertypehasprivilages.privilage_id=privilage.idPrivilage INNER JOIN utype ON usertypehasprivilages.utype_id=utype.idUtype WHERE utype.idUtype=" + req.body.idUtype,
            (error, rows, fildData) => {
                if (!error) {
                    res.send(rows);
                } else {
                    console.log(error);
                    return res.send(error);
                }
            });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}
// getPrivilagesByUserId (userId) - > {all privilages filtered by user}


// assignPrivilagesToUser (userId, privId) - > {boolean true json data}


// removePrivilagesFromUser (userId, privId)  - > {boolean true json data}
