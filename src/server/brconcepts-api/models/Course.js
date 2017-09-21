var mongoose = require('mongoose');

//mongoose.connect('mongodb://localhost/brconcepts');

var CourseSchema = new mongoose.Schema({
    name: String,
    instructor: String,
    active: Boolean,
    description: String,
    created_at: {type:Date, default: Date.now},
    updated_at: { type: Date, default: Date.now },
});

// Create a model based on the schema
// var Course = mongoose.model('Course', CourseSchema);
//
// var course = new Course({name: 'Node', instructor: 'Sruthi', active: false, description: 'Not Getting there...'});

// Course.create(course,function(err){
//         if(err)
//             console.log(err);
//         else
//             console.log(course);
//     });

// // Find All
// Course.find(function (err, courses) {
//     if (err) return console.error(err);
//     console.log(courses)
// });

// // Find By Id
// Course.findById('59c1d28e1de1bf329861156d',function (err, courses) {
//     if (err) return console.error(err);
//     console.log(courses)
// });

// Update one Course by Id
//     Course.findByIdAndUpdate('59c1d28e1de1bf329861156d', {$set:{active : true, updated_at: Date.now()}},function (err, courses) {
//         if (err) return console.error(err);
//         console.log(courses)
//     });

// Delete One Course By Id
// Course.findByIdAndRemove('59c1b80ccd0a6b1954793ec0',function (err, courses) {
//         if (err) return console.error(err);
//         console.log(courses)
//     });

module.exports = mongoose.model('Course', CourseSchema);
