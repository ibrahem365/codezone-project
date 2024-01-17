
const express = require('express');

const router = express.Router();

const coursesControler = require('../controllers/courses.controller')
const authToken = require('../middlewares/authToken');
const allowedTo = require('../middlewares/allowedTo');

const { newCorseValid } = require('../middlewares/ValidationSchema');
const userRoles = require('../utils/userRoles');

router.route('/')
    .get(authToken, coursesControler.getAllCourses)
    .post(authToken, newCorseValid(), coursesControler.addCourse);

router.route('/:id')
    .get(authToken, coursesControler.getCourse)
    .patch(authToken, coursesControler.updateCourse)
    .delete(authToken, allowedTo(userRoles.ADMIN, userRoles.MANGER), coursesControler.deleteCourse);

module.exports = router;