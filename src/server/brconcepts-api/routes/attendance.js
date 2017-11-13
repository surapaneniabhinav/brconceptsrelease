var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Attendance = require('../models/Attendance.js');

router.get('/', function(req, res, next) {
    Attendance.find(function (err,students) {
        if (err) return next(err);
        res.json(students);
    })
});
router.get('/getStudentsByCourse/:courseId', function(req, res, next) {
    Attendance.find({course: req.params.courseId},function (err,students) {
        if (err) return next(err);
        res.json(students);
    })
});

router.get('/:id', function(req, res, next) {
    Attendance.findById(req.params.id, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});
//
router.post('/', function(req, res, next) {
    Attendance.create(req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

router.put('/:id', function(req, res, next) {
    Attendance.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

// router.delete('/:id', function(req, res, next) {
//     Attendance.findByIdAndRemove(req.params.id, req.body, function (err, post) {
//         if (err) return next(err);
//         res.json(post);
//     });
// });

module.exports = router;
