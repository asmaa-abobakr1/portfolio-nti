const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const contactSchema = new mongoose.Schema({



    header: {
        title: { type: String, default: "Get In Touch" },
        subtitle: { type: String, default: "Have a project in mind or just want to chat?" }
    },


    info: {
        email: { type: String, default: "asmaaahmed29699@gmail.com" },
        location: { type: String, default: "Remote / Available Worldwide" }
    },


    workingTogether: {
        title: { type: String, default: "Let's Work Together" },
        description: { type: String, default: "I'm currently available for freelance projects..." }
    },
    messages: [{
        name: { type: String, required: true },
        email: { type: String, required: true },
        message: { type: String, required: true },
        sentAt: { type: Date, default: Date.now },
        isDeleted: { type: Boolean, default: false }
    }]
}, { timestamps: true });

const Contact = mongoose.model('Contact', contactSchema);
router.get('/admin/dashboard', async (req, res) => {
    try {
        const contactData = await Contact.findOne();
        if (!contactData) return res.status(200).json([]);
     const activeMessages = contactData.messages.filter(msg => msg.isDeleted === false);
        
     res.status(200).json(activeMessages);
    } catch (err) {
 res.status(500).json({ error: err.message });
    }
});
router.delete('/admin/message/:id', async (req, res) => {
    try {
        const updatedContact = await Contact.findOneAndUpdate(
            { "messages._id": req.params.id },
            { $set: { "messages.$.isDeleted": true } }, // بنغير الحالة لـ true بدل المسح
            { new: true }
        );

if (!updatedContact) {
            return res.status(404).json({ message: "Message not found" });
        }

        res.status(200).json({ message: "Message moved to trash (Soft Deleted) 🗑️" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});
router.get('/admin/archive', async (req, res) => {
    try {
        const contactData = await Contact.findOne();
const deletedMessages = contactData.messages.filter(msg => msg.isDeleted === true);
        res.status(200).json(deletedMessages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.post('/send', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        await Contact.findOneAndUpdate({}, { $push: { messages: { name, email, message } } },
             { upsert: true });
        res.status(201).json({ message: "Message sent!" });
    } 
catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/update-page', async (req, res) => {
    try {
        const updated = await Contact.findOneAndUpdate({},
         req.body, { upsert: true, new: true });
        res.status(200).json(updated);
    }
 catch (err) { res.status(400).json({ error: err.message }); }
});

module.exports = router;