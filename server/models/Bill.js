const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Paid', 'Unpaid', 'Pending'],
        default: 'Unpaid'
    },
    category: {
        type: String,
        default: 'Others'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Bill', billSchema);
