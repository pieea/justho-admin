var express = require('express');
var upload = require('jquery-file-upload-middleware');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


const redis = require('redis');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const redisClient = redis.createClient(6379, 'localhost');
const fixation = require('express-session-fixation');

// 인증
const mustBe = require('mustbe');
const mustBeConfig = require('./mustbe-config');

mustBe.configure(mustBeConfig);

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// configure upload middleware
upload.configure({
    uploadDir: __dirname + '/public/uploads',
    uploadUrl: '/uploads'
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/upload', upload.fileHandler());

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const sessionStore = new RedisStore({
    client: redisClient,
    prefix: 'session:',
    db: 0,
    ttl: 600
});

app.use(session({
    secret: 'admin',
    store: sessionStore,
    // cookie: { secure: true },
    // cookie: { maxAge: 60000 },
    saveUninitialized: true,
    resave: false
}));

redisClient.on('error', (err) => {
    console.log('could not connect ', err);
});

redisClient.on('connect', () => {
    console.log('redis connected');
});

module.exports = app;
