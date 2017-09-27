var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Payment = require('../models/Payment.js');

/* GET payments listing. */
router.get('/', function(req, res, next) {
    Payment.find(function (err,staffs) {
        if (err) return next(err);
        res.json(staffs);
    })
});

/* GET /payments/id */
router.get('/:id', function(req, res, next) {
    Payment.findById(req.params.id, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

router.post('/', function(req, res, next) {
    Payment.create(req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* PUT /payment/:id */
router.put('/:id', function(req, res, next) {
    Payment.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* DELETE /payment/:id */
router.delete('/:id', function(req, res, next) {
    Payment.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

module.exports = router;
