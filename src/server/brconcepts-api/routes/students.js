var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Student = require('../models/Student.js');

/* GET staffs listing. */
router.get('/', function(req, res, next) {
    Student.find(function (err,staffs) {
        if (err) return next(err);
        res.json(staffs);
    })
});

router.post('/', function(req, res, next) {
    Student.create(req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* GET /staff/id */
router.get('/:id', function(req, res, next) {
    Student.findById(req.params.id, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* PUT /staff/:id */
router.put('/:id', function(req, res, next) {
    Student.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* DELETE /staff/:id */
router.delete('/:id', function(req, res, next) {
    Student.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

module.exports = router;
