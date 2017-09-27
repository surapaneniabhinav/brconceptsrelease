var mongoose = require('mongoose');

var PaymentSchema = new mongoose.Schema({
    type:{
        income: Boolean,
        expense: Boolean
    },
    name: String,
    amount: Number,
    paid: Boolean,
    pending:Boolean,
    paymentdate: Date,
    description: String,
    created_at: {type:Date, default: Date.now},
    updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Payment', PaymentSchema);