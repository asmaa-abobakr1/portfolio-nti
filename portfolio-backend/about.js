const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const aboutSchema = new mongoose.Schema({
    bio: { 
        type: String, 
        required: [true, 'Bio is required'] 
    },
    stats: {
        yearsExperience: { type: String, default: "1+" },
        projectsCompleted: { type: String, default: "20+" }
    },
    experiences: [{
    role: String,
    company: String,
    duration: String,
    location: String,
    isDeleted: { type: Boolean, default: false }
}],
skills: [{
    categoryName: String,
    technologies: [String],
    isDeleted: { type: Boolean, default: false }
}],
    values: [{
        icon: String,
        title: String,
        description: String
    }]
}, 
{ timestamps: true });

const About = mongoose.model('About', aboutSchema);

router.get('/', async (req, res) => {
    try {
        const aboutData = await About.findOne();
        res.status(200).json(aboutData);
    } 
    catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { bio, stats, experiences, skills, values } = req.body;
const updatedAbout = await About.findOneAndUpdate({}, 
            { bio, stats, experiences, skills, values }, 
            { upsert: true, new: true, runValidators: true }
        );

        res.status(201).json({
            message: "About data updated successfully!",
            data: updatedAbout
        });
    } 
catch (err) {
        res.status(400).json({ message: "Validation Error", error: err.message });
    }
});

router.delete('/experience/:id', async (req, res) => {
    try {
        await About.findOneAndUpdate(
            { "experiences._id": req.params.id },
            { $set: { "experiences.$.isDeleted": true } }
        );
        res.status(200).json({ message: "Experience soft-deleted!" });
    }
     catch (err) {
         res.status(400).json({ error: err.message }); }
});

module.exports = router;