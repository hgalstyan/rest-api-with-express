const express = require('express');
const middleware = require('../middleware/auth');
const User = require('../models/model').User;
const router = express.Router();


//GET and Authenticate a user
router.get('/', middleware.authenticate, (req, res) => {
	return res.json(req.user);
  res.status(200);
});

//POST a new User
router.post('/', (req, res, next) => {

	if (req.body.fullName &&
	req.body.email &&
	req.body.password) {

		const userData = {
			fullName: req.body.fullName,
			email: req.body.email,
			password: req.body.password
		};
		console.log(userData);
		User.create(userData, error => {
			if (error) {
				return next(error);
			}

			res.location('/');
			return res.end();
		});
	} else {
		const error = new Error('All fields required');
		error.status = 400;
		return next(error);
	}
});

module.exports = router;
