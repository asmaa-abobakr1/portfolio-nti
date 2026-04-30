const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


const serviceSchema = new mongoose.Schema({
    hero: {
        title: { type: String, default: "Services I Offer" },
        subtitle: { type: String, default: "Professional web development services tailored to bring your ideas to life..." }
},

servicesList: [{
        icon: { type: String },
        title: { type: String, required: true },
        description: { type: String, required: true },
    isDeleted: { type: Boolean, default: false }
    }],
    footerAction: {
        title: { type: String, default: "Ready to Start Your Project?" },
        description: { type: String, default: "Let's collaborate to create something amazing..." }
    }
}, 
{ timestamps: true });

const Service = mongoose.model('Service', serviceSchema);

router.get('/', async (req, res) => {
    try {
        const data = await Service.findOne();
        if (!data) return res.status(404).json({ message: "No services data found" });
        const activeServices = data.servicesList.filter(s => s.isDeleted === false);
        
        res.status(200).json({
            hero: data.hero,
        services: activeServices,
            footerAction: data.footerAction
        });
    } 
catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.post('/add', async (req, res) => {
    try {
        const { icon, title, description } = req.body;
const updatedData = await Service.findOneAndUpdate(
            {},
            { $push: { servicesList: { icon, title, description } } },
            { upsert: true, new: true }
        );
        res.status(201).json({ message: "Service added!", data: updatedData });
    } 
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.put('/update-content', async (req, res) => {
    try {
        const { hero, footerAction } = req.body;
        const updated = await Service.findOneAndUpdate(
            {},
            { hero, footerAction },
            { upsert: true, new: true }
        );
        res.status(200).json({ message: "Content updated!", data: updated });
    } 
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        await Service.findOneAndUpdate(
            { "servicesList._id": req.params.id },
            { $set: { "servicesList.$.isDeleted": true } }
        );
        res.status(200).json({ message: "Service moved to trash (Soft Deleted) 🗑️" });
    } 
catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;