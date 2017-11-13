var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var AttendanceSchema = new mongoose.Schema({
    course: { type: ObjectId, ref: 'courses' },
    studentName: String,
    actualDays: Number,
    presentDays: Number,
    absentDays: Number
},{timestamps: true});

module.exports = mongoose.model('Attendance', AttendanceSchema);
