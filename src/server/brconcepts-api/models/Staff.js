var mongoose = require('mongoose');

var StaffSchema = new mongoose.Schema({
    name: String,
    address: String,
    mobilenumber: Number,
    designation: String,
    course: String,
    salary: Number
});

module.exports = mongoose.model('Staff', StaffSchema);