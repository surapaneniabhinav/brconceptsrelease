var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Student = require('../models/Student.js');

router.get('/:date',function (req,res,next) {
    Student.find({"registrationdate": req.params.date}, function (err, students) {
        if (err) return next(err);
        res.json(students);
    });
});


module.exports = router;