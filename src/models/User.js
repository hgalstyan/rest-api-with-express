const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

//SHEMAS
const UserSchema = new mongoose.Schema({
    fullName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      unique: true,
      required: true,
      validate: {
			     validator(value) {
				         // Regex from http://emailregex.com
				         return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
			     },
			     message: '{VALUE} is not a valid email address'
		  }
    },
    password: {
      type: String,
      required: true
    }
});

// Authenticate input
UserSchema.statics.authenticate = function (email, password, callback) {
	this.findOne({emailAddress: email})
		.exec((error, user) => {
			if (error) {
				return callback(error);
			} else if (!user) {
				const error = new Error('User not found.');
				error.status = 401;
				return callback(error);
			}

			bcrypt.compare(password, user.password, (error, result) => {
				if (result) {
					return callback(null, user);
				}
				return callback();
			});
		});
};

//hashing password
UserSchema.pre('save', function (next) {
	bcrypt.hash(this.password, 10, (error, hash) => {
		if (error) {
			return next(error);
		}
		this.password = hash;
		next();
	});
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
