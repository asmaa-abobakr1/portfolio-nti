const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const upload = require('./utilits/upload');
const homeSchema = new mongoose.Schema({
    jobTitle: { type: String, required: true },
    name: { type: String, required: true },
    mainDescription: String,
    profileImage: String,
    socialLinks: {
        github: String,
        linkedin: String
    },


    services: [{
    title: String,
    description: String,
    isDeleted: { type: Boolean, default: false } // الحقل الجديد
}]

}, { timestamps: true });

const Home = mongoose.model('Home', homeSchema);
router.get('/', async (req, res) => {
    try {
        const homeData = await Home.findOne();
        res.status(200).json(homeData);
    } 
catch (err) {
        res.status(500).json({ 
            message: "Error fetching home data", 
            error: err.message 
        });
    }
});
router.post('/', upload.single('profileImage'), async (req, res) => {
    try {
        const { jobTitle, name, mainDescription, github, linkedin, services } = req.body;
        
let parsedServices = [];
        if (services) {
            try {
                parsedServices = JSON.parse(services);
            }
             catch (err) {
                return res.status(400).json({ message: "Invalid format for services array" });
            }
        }

        const updateData = {
            jobTitle,
            name,
            mainDescription,
            socialLinks: { github, linkedin },
            services: parsedServices
        };

        if (req.file) {
            updateData.profileImage = req.file.path;
        }

    const home = await Home.findOneAndUpdate({}, updateData, { upsert: true, new: true });
        res.status(201).json(home);

    } 
    catch (err) {
        res.status(400).json({ 
            message: "Error saving home data", 
            error: err.message 
        });
    }
});

router.delete('/service/:id', async (req, res) => {
    try {
        await Home.findOneAndUpdate(
            { "services._id": req.params.id },
            { $set: { "services.$.isDeleted": true } }
        );
     res.status(200).json({ message: "Service soft-deleted!" });
    } 
    
catch (err) { res.status(400).json({ error: err.message }); }
});

module.exports = router;