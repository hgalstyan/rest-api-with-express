'use strict';

const auth = require('basic-auth');          //  Generic basic auth Authorization header field parser for whatever
const User = require('../models/model').User;

//  From https://www.npmjs.com/package/basic-auth
//  =============================================
//  Get the basic auth credentials from the given request. (const authorized = auth(req);)
//  The Authorization header is parsed and if the header is invalid, "undefined" is returned,
//  otherwise an object with name and pass properties is returned.

const authenticate = (req, res, next) => {
  
    const authorizedUser = auth(req)

    if(!authorizedUser){
        const err = new Error('Authorization Not Found');
        err.status = 401;
        return next(err);
    } else {
        User.authenticate(authorizedUser.name, authorizedUser.pass, (err, user) => {
            if (err) {
                let err = new Error('Your credentials were not found');
                err.status = 403;
                return next(err);
            } else {
                req.user = user;
                next();
            }
        });
    }
}

module.exports.authenticate = authenticate;
