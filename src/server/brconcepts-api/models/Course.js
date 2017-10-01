var mongoose = require('mongoose');

var CourseSchema = new mongoose.Schema({
    name: String,
    instructor: String,
    active: Boolean,
    description: String,
    created_at: {type:Date, default: Date.now},
    updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Course', CourseSchema);
