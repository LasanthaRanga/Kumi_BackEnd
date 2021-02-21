var express = require('express');
var router = express.Router();
const invoice = require('../controllers/invoice/invoice');

const checkAuth = require('../middleware/check-auth');

//user
router.post("/getAllInvoice", invoice.getAllInvoice);
router.post("/getInvoicePayment", invoice.getInvoicePayment);
router.post("/getTotPaid", invoice.getTotPaid);
router.post("/newInvoice", invoice.newInvoice);
router.post("/getInvoiceData", invoice.getInvoiceData);
router.post("/getFullIncom", invoice.getFullIncom);




module.exports = router;