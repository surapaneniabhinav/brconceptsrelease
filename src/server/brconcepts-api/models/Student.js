var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/brconcepts');

var StudentSchema = new mongoose.Schema({
    name: String,
    course: String,
    registrationdate: Date,
    mobilenumber: Number,
    email: String,
    amount: Number,
    amountpaid: Boolean,
    active: Boolean,
    created_at: {type:Date, default: Date.now},
    updated_at: { type: Date, default: Date.now },
});

// var Student = mongoose.model('Student', StudentSchema);
//
//
// Student.find({"registrationdate" : new Date("2017-09-06T04:00:00Z") },function (err, students) {
//     if (err) return console.error(err);
//     console.log(students)
// });

module.exports = mongoose.model('Student', StudentSchema);