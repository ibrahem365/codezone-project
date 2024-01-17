
const httpStatusText = require('../utils/httpStatusText');
const appError = require('../utils/appError');

module.exports = (...args) => {
    return (currentUser, req, res, next) => {
        if (!args.includes(req.currentUser.role)) {
            const error = appError.create("you are not allowed to do this action", 403, httpStatusText.FAIL);
            return next(error);
        }
        next()
    }
}