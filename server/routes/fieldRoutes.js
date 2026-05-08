const express = require('express');
const router = express.Router();
const FieldConfig = require('../models/FieldConfig');

// Get all field configs
router.get('/', async (req, res) => {
    try {
        const configs = await FieldConfig.find();
        res.json(configs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update/Save all field configs
router.post('/sync', async (req, res) => {
    try {
        // Simple approach: delete all and re-insert
        await FieldConfig.deleteMany({});
        const newConfigs = await FieldConfig.insertMany(req.body);
        res.status(201).json(newConfigs);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
