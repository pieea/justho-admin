var User = require("../model/user");
var express = require('express');
var router = express.Router();

router.get("/login", function(req, res, next){
    req.query.prev = req.query.prev || "/";
    var ip = req.connection.remoteAddress;

    res.render("login", {prev: req.query.prev, ip: ip});
});

router.get("/logout", function(req, res, next) {
    if(req.session.key) {
        req.session.destroy(function() {
            res.clearCookie('connect.sid');
            res.redirect("/users/login?message=you are logged out now");
        });
    } else {
        res.redirect('/');
    }
});

router.post("/login", function(req, res, next){
    var username = req.body.username;
    var password = req.body.password;
    var prev = req.body.prev && req.body.prev.startsWith("/") ? req.body.prev : "/";

    User.login(req, username, password, function(err, user){
        if (err) {
            res.redirect('/users/login');
        } else {
            if (user) {
                req.session.regenerate(function(err) {
                    req.session.key = username;
                    res.redirect(prev);
                });
            } else {
            }
        }

    });
});

module.exports = router;
