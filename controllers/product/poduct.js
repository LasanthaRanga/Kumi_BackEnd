const mycon = require('../../util/conn');
const jwt = require('jsonwebtoken');
const bcript = require('bcrypt');
var dateFormat = require('dateformat');

//getProduct
exports.getAllProduct = (req, res, next) => {
    try {
        mycon.execute("SELECT sw_prod.idProd,sw_prod.prodName FROM sw_prod",
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