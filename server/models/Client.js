const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    data: {
        type: Map,
        of: mongoose.Schema.Types.Mixed
    }
}, { timestamps: true });

module.exports = mongoose.model('Client', clientSchema);
