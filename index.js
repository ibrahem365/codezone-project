
require('dotenv').config();
const express = require('express');
const path = require('path');

const cors = require('cors');
const app = express();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const httpStatusText = require('./utils/httpStatusText');

const mongoose = require('mongoose');

const url = process.env.MONGO_URL;
mongoose.connect(url).then(() => {
    console.log("mongo connected successfully");
})

app.use(cors());
app.use(express.json());

const coursesRouter = require('./routes/courses.routes');
const usersRouter = require('./routes/users.routes');

app.use('/api/courses', coursesRouter);
app.use('/api/users', usersRouter);

app.all('*', (req, res, next) => {
    res.json({ status: httpStatusText.ERROR, data: "this resource not found" })
});

app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({ status: err.statusText || httpStatusText.ERROR, code: err.statusCode || 500, msg: err.message })
})

app.listen(process.env.PORT || 5000, () => {
    console.log("listen in port 5000");
})

// (44.00)

