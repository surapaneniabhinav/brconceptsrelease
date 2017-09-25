var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Staff = require('../models/Staff.js');

/* GET staffs listing. */
router.get('/', function(req, res, next) {
    Staff.find(function (err,staffs) {
        if (err) return next(err);
        res.json(staffs);
    })
});

router.post('/', function(req, res, next) {
    Staff.create(req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* GET /staff/id */
router.get('/:id', function(req, res, next) {
    Staff.findById(req.params.id, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* PUT /staff/:id */
router.put('/:id', function(req, res, next) {
    Staff.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* DELETE /staff/:id */
router.delete('/:id', function(req, res, next) {
    Course.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

module.exports = router;
