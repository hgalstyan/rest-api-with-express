const express =  require("express");
const router = new express.Router();

const user = require('./users');
router.use('/users', user);

const courses = require('./courses');
router.use('/courses', courses);


module.exports = router;
