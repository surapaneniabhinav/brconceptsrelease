var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Student = require('../models/Student.js');
router.get('/:startDate&:endDate',function (req,res,next) {
    Student.find({"registrationdate": {"$gte": req.params.startDate, "$lte": req.params.endDate } },function (err,students) {
        if (err) return next(err);
        res.json(students);
    })
});
module.exports = router;