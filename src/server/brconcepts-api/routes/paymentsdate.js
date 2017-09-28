var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Payment = require('../models/Payment.js');

router.get('/:date',function (req,res,next) {
    Payment.find({"paymentdate": req.params.date}, function (err, payments) {
        if (err) return next(err);
        res.json(payments);
    });
});


module.exports = router;