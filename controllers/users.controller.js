

const asyncWrapper = require('../middlewares/asyncWrapper');
const User = require('../models/users.model');
const httpStatusText = require('../utils/httpStatusText');
const bycrypt = require('bcryptjs');
const generateToken = require('../utils/generateJWT');

const appError = require('../utils/appError');

const getAllUsers = asyncWrapper(async (req, res) => {

    const queryParams = req.query;
    const limit = queryParams.limit || 10;
    const page = queryParams.page || 1;
    const skip = (page - 1) * limit;

    const users = await User.find({}, { "__v": false, password: false }).limit(limit).skip(skip);
    res.json({ status: httpStatusText.SUCCESS, data: { users } });
});

const register = asyncWrapper(async (req, res, next) => {

    const { firstName, lastName, email, password, role } = req.body;

    const oldUser = await User.findOne({ email: email })
    if (oldUser) {
        const error = appError.create("user already exists", 400, httpStatusText.FAIL);
        return next(error);
    }

    const hashPass = await bycrypt.hash(password, 10);

    const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashPass,
        role,
        avatar: req.file.filename
    });

    newUser.token = await generateToken({ email: newUser.email, id: newUser._id, role: newUser.role });

    await newUser.save();
    res.status(201).json({ status: httpStatusText.SUCCESS, data: { user: newUser } });

});

const login = asyncWrapper(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        const error = appError.create("email and pass is required", 400, httpStatusText.FAIL);
        return next(error);
    }

    const chcUser = await User.findOne({ email: email })
    if (!chcUser) {
        const error = appError.create("user not exists", 400, httpStatusText.FAIL);
        return next(error);
    }

    const isMatch = await bycrypt.compare(password, chcUser.password);
    if (!isMatch) {
        const error = appError.create("invalid password", 400, httpStatusText.FAIL);
        return next(error);
    }

    const token = await generateToken({ email: chcUser.email, id: chcUser._id, role: chcUser.role });
    res.status(200).json({ status: httpStatusText.SUCCESS, data: { msg: "logged successfully", token } });
});

module.exports = {
    getAllUsers,
    register,
    login
}

//(56.00) jwt