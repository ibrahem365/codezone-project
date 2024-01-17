

const asyncWrapper = require('../middlewares/asyncWrapper');
const Course = require('../models/courses.model');
const httpStatusText = require('../utils/httpStatusText');

const appError = require('../utils/appError');

const { validationResult } = require('express-validator');

const getAllCourses = asyncWrapper(async (req, res) => {

    const queryParams = req.query;
    const limit = queryParams.limit || 10;
    const page = queryParams.page || 1;
    const skip = (page - 1) * limit;

    const courses = await Course.find({}, { "__v": false }).limit(limit).skip(skip);
    res.json({ status: httpStatusText.SUCCESS, data: { courses } });
});

const getCourse = asyncWrapper(
    async (req, res, next) => {

        const course = await Course.findById(req.params.id);
        if (!course) {
            const error = appError.create("course not found", 404, httpStatusText.FAIL);
            return next(error);
        }
        return res.json({ status: httpStatusText.SUCCESS, data: { course } });

    });

const addCourse = asyncWrapper(async (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = appError.create(errors.array(), 400, httpStatusText.FAIL)
        return next(error);
    }

    const newCourse = new Course(req.body);
    await newCourse.save();
    res.status(201).json({ status: httpStatusText.SUCCESS, data: { courses: newCourse } });

});

const updateCourse = asyncWrapper(async (req, res, next) => {

    await Course.findByIdAndUpdate(req.params.id, { $set: { ...req.body } })
    const updatedCourse = await Course.findById(req.params.id);
    return res.json({ status: httpStatusText.SUCCESS, data: { course: updatedCourse._doc } });
});

const deleteCourse = asyncWrapper(async (req, res) => {

    await Course.deleteOne({ _id: req.params.id })
    res.json({ status: httpStatusText.SUCCESS, data: null });

});

module.exports = {
    deleteCourse,
    updateCourse,
    addCourse,
    getCourse,
    getAllCourses
}

// (27.20) vid 7