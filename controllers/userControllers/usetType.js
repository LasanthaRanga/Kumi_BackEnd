const mycon = require('../../util/conn');


// getUserTypes
exports.getAllUserType = (req, res, next) => {
    try {
        mycon.execute("select * from utype",
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