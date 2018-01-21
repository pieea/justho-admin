var account = require('../account');

function User(username, password, roles, code, excludeBook) {
    this.username = username;
    this.password = password;
    this.roles = roles;
    this.code = code;
    this.excludeBook = excludeBook;
};

User.login = function(req, username, password, cb){
    if(account.entry[username] && password == account.entry[username].password) {
        var user = new User(username, password, account.entry[username].role, account.entry[username].code, account.entry[username].excludeBook);
        cb(null, user);
    } else {
        cb("not authenticated user", null);
    }
};

User.loginFromCookie = function(req, cookie, cb){
    // this would involve database logic to convert a cookie id
    // in to a user object, most likely. i'm just hard coding it
    // for demo purposes
    var user;
    if (cookie) {
        var username = cookie;
        if(account.entry[username]) {
            if (username) {
                user = new User(username, '', account.entry[username].role, account.entry[username].code, account.entry[username].excludeBook);
            }
        } else {
        }
    }
    cb(null, user);
};

User.loginFromSession = function(req, session, cb){

    var user;
    if (session) {
        var username = session;
        if(account.entry[username]) {
            if (username) {
                user = new User(username, '', account.entry[username].role, account.entry[username].code, account.entry[username].excludeBook);
            }
        } else {
        }
    }
    cb(null, user);
};


module.exports = User;