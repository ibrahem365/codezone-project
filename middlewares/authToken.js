
const jwt = require('jsonwebtoken');
const httpStatusText = require('../utils/httpStatusText');
const appError = require('../utils/appError');

module.exports = (req, res, next) => {

    const auth = req.headers['Authorization'] || req.headers['authorization'];
    if (!auth) {
        const error = appError.create("token is required", 400, httpStatusText.FAIL);
        return next(error);
    }
    const token = auth.split(' ')[1];

    try {
        const currentUser = jwt.verify(token, process.env.JWT_TOKEN);
        req.currentUser = currentUser;
        next();

    } catch (err) {
        const error = appError.create("token is invalid", 401, httpStatusText.FAIL);
        return next(error);
    }

};