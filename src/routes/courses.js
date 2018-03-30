const express = require('express');
const Course = require('../models/model').Course;
const middleware = require('../middleware/auth');
const Review = require('../models/model').Review;
const router = express.Router();

//GET COURSES
router.get('/', (req, res, next) => {
    Course.find({},'course_id title').exec((err, courses) => {
        if(err){
            err.status = 400;
            return next(err);
        }
        res.status(200);
        res.json(courses);
    });
});

//POST a new course
router.post('/', middleware.authenticate, (req, res, next) => {
    const course = new Course(req.body);
    course.save((err, course) => {
        if (err) { return next(err); }
        res.status(201);
        res.json();
    });
});



//GET INDIVIDUAL COURSE
router.get('/:courseID', function(req, res, next) {
    Course.findById(req.params.courseID)
        .populate({
            path: 'user',
            select: 'fullName'
        })
        .populate({
            path: 'reviews',
            populate: {
                path: 'user',
                model: 'User',
                select: 'fullName'
            }
        })
        .exec((err, courses) => {
            if(err){
                err.status = 400;
                return next(err);
            }
        res.status(200);
        res.json(courses);
    });
});


//UPDATE A COURSE
router.put('/:courseToUpdateID', middleware.authenticate, function(req, res, next) {
    Course.findByIdAndUpdate(req.body._id, req.body, function(err){
        if(err){
            err.status = 400;
            return next(err);
        }
        res.status(204).json();
    });
});



//POST a course review
router.post('/:courseId/reviews', middleware.authenticate, (req, res, next) => {
	Course.findById(req.params.courseId)
	.populate('user')
	.populate('reviews')
	.exec(function(err, course) {
		if (err) {
			 return next(err);
		}

	// Ensure review user is not the owner of the course
	if (req.user._id === course.user) {
		const error = new Error('Course creator cannot review that course.');
		error.status = 401;
		return next(error);
	}

	var review = new Review(req.body);
	review.postedOn = Date.now();
	course.reviews.push(review);


	review.save(req.body, function (err){
			if (err){
				return next(err);
			}

	})
		course.save(error => {
			if (error) {
				return next(error);
			}
			res.location('/:courseID');
            res.status(201).json();

		});
	});
});


module.exports = router;
