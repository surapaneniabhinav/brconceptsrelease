var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Payment = require('../models/Payment.js');

router.get('/',function (req,res,next) {
    Payment.find({"type": "expense"}, function (err, payments) {
        if (err) return next(err);
        res.json(payments);
    });
});

router.get('/:date',function (req,res,next) {
    Payment.find({"type": "expense","paymentdate": req.params.date}, function (err, payments) {
        if (err) return next(err);
        res.json(payments);
    });
});


module.exports = router;