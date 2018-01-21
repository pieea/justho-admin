var mustBe = require("mustbe");
var User = require("./model/user");
var account = require("./account");

module.exports = function(config){

    config.routeHelpers(function(rh){
        rh.getUser(function(req, cb){
            var session = req.session && req.session.key;
            User.loginFromSession(req, session, function(err, user){
                cb(null, user);
            });
        });

        rh.notAuthorized(function(req, res, next){
            var session = req.session && req.session.key;

            if(session) {
                User.loginFromSession(req, session, function (err, user) {
                    res.redirect("/users/login?msg=you_are_not_authorized!&prev=" + encodeURIComponent(req.baseUrl));
                });
            } else {
                res.redirect("/users/login?msg=you_are_not_authorized");
            }
        });

        rh.notAuthenticated(function(req, res, next){
            res.redirect("/users/login?msg=you_must_log_in_first!&prev=" + encodeURIComponent(req.originalUrl));
        });
    });

    config.userIdentity(function(id){
        id.isAuthenticated(function(user, cb){
            var isAuthenticated = !!user;
            return cb(null, isAuthenticated);
        });
    });

    config.activities(function(activities){
        activities.can("admin", function(identity, params, cb){
            var user = identity.user;
            cb(null, account.roles[user.roles].priority <= account.roles['admin'].priority);
        });

        activities.can("manager", function(identity, params, cb){
            var user = identity.user;
            cb(null, account.roles[user.roles].priority <= account.roles['manager'].priority);
        });
    });
};