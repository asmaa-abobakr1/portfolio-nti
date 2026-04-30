const express = require('express');
const mongoose = require('mongoose');
const port = 3000;
const app = express();

app.use(express.json());
app.use('/files', express.static('./uploads'));

app.use((req, res, next) => {
    const allowedOrigins = ['http://localhost:4200', 'http://127.0.0.1:4200'];
    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }

    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }

    next();
});

// db
const connectDB = async () => {
    try {

        await mongoose.connect('mongodb://localhost:27017/Portfolidb');
        console.log('Connected to MongoDB Successfully');
    } catch (err) {
        console.error('Database Connection Error:', err.message);
    }
};

connectDB();
const homeRoutes = require('./home');
app.use('/home', homeRoutes);

const aboutRoutes = require('./about');
app.use('/about', aboutRoutes);

const contactRoutes = require('./contact');
app.use('/contact', contactRoutes);

const projectRoutes = require('./projects');
app.use('/projects', projectRoutes);

const serviceRoutes = require('./services');
app.use('/services', serviceRoutes);








app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
