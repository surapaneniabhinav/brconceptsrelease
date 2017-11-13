var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;


var StudentSchema = new mongoose.Schema({
    name: String,
    course: { type: ObjectId, ref: 'courses' },
    registrationdate: Date,
    mobilenumber: Number,
    email: String,
    amount: Number,
    balance: Number,
    amountpaid: Boolean,
    description: String,
    active: Boolean,
    created_at: {type:Date, default: Date.now},
    updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Student', StudentSchema);