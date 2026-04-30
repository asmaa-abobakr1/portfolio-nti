const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const upload = require('./utilits/upload');


const projectPageSchema = new mongoose.Schema({
    title: { type: String, default: "My Projects" },
    subtitle: { type: String, default: "a showcase of my recent work..." }
});
const ProjectPage = mongoose.model('ProjectPage', projectPageSchema);
const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    tools: [String],
    liveDemo: { type: String },
    githubCode: { type: String },
    isDeleted: { type: Boolean, default: false }
}, 

{ timestamps: true });

const Project = mongoose.model('Project', projectSchema);
router.get('/', async (req, res) => {
    try {
        const pageInfo = await ProjectPage.findOne() || { title: "My Projects", subtitle: "showcase..." };
        const projects = await Project.find({ isDeleted: false });
        
    res.status(200).json({
            pageHeader: pageInfo,
            projectsList: projects
        });
    } 
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.put('/update-header', async (req, res) => {
    try {
        const { title, subtitle } = req.body;
        const updatedHeader = await ProjectPage.findOneAndUpdate(
            {},
            { title, subtitle },
            { upsert: true, new: true }
        );
        res.status(200).json({ message: "Header updated!", data: updatedHeader });
    } 
    
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
router.post('/add', upload.single('image'), async (req, res) => {
    try {
        const { title, description, tools, liveDemo, githubCode } = req.body;
        const parsedTools = typeof tools === 'string'
            ? tools.split(',').map(tool => tool.trim()).filter(Boolean)
            : tools;

        const newProject = new Project({
            title,
            description,
            tools: parsedTools,
            liveDemo,
            githubCode,
            image: req.file ? req.file.filename : req.body.image
        });

        await newProject.save();
        res.status(201).json({ message: "Project added!" });
    } 
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
router.delete('/delete/:id', async (req, res) => {
    try {
        await Project.findByIdAndUpdate(req.params.id, { isDeleted: true });
        res.status(200).json({ message: "Project moved to trash" });
    } 
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
module.exports = router;
