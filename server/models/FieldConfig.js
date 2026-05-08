const mongoose = require('mongoose');

const fieldConfigSchema = new mongoose.Schema({
    label: { type: String, required: true },
    name: { type: String, required: true }, // camelCase name for data storage
    type: { 
        type: String, 
        enum: ['text', 'number', 'select', 'date', 'email', 'nested_select'], 
        default: 'text' 
    },

    required: { type: Boolean, default: false },
    options: [String], // For simple select
    nestedOptions: { type: Array, default: [] }, // For cascading select: [{ label, value, children: [] }]
}, { timestamps: true });


module.exports = mongoose.model('FieldConfig', fieldConfigSchema);
