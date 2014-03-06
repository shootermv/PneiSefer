var passport =  require('passport')
require('../models/User.js');
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = {
    register: function(req, res, next) {
	    console.log('register details:', req.body);
		var user = new User(req.body);
		
        user.save(function (err) { 
		    if(!err){
		      res.json(200,'hi');
			}else{
			  console.log('error while creating user...');
			  res.json(400,'err');
			}
		});
		
		
    },

    login: function(req, res, next) {
        setTimeout(function(){	
        passport.authenticate('local', function(err, user) {
            
            if(err)     { return next(err); }
			//console.log('here...',user)
            if(!user)   { return res.send(400); }

            
            req.logIn(user, function(err) {
                if(err) {
				    console.log('error-',err);
                    return next(err);
                }
                
                if(req.body.rememberme) req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7;
                res.json(200, {
				  'name':user.firstname + ' ' + user.lastname,
				  'phone':user.phone 
				});
            });
        })(req, res, next);
		},2000);
    },

    logout: function(req, res) {
        req.logout();
        res.send(200);
    }
};