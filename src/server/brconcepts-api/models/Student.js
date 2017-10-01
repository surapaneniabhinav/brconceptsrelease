var mongoose = require('mongoose');

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

module.exports = mongoose.model('Student', StudentSchema);