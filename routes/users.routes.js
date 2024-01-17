
const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const authToken = require('../middlewares/authToken');

const multer = require('multer');
const appError = require('../utils/appError');
const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        const extension = file.mimetype.split('/')[1];
        const fileName = `user${Date.now()}.${extension}`;
        cb(null, fileName)
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.split('/')[0] === 'image') {
        return cb(null, true);
    } else {
        return cb(appError.create('file must be image', 400), false);
    }
}

const uploads = multer({
    storage: diskStorage,
    fileFilter
})

router.route('/')
    .get(authToken, usersController.getAllUsers);

router.route('/register')
    .post(uploads.single('avatar'), usersController.register);

router.route('/login')
    .post(usersController.login);

module.exports = router;

// (01.2)