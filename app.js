var express = require('express');
var upload = require('jquery-file-upload-middleware');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const methodOverride = require('method-override');

const redis = require('redis');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const redisClient = redis.createClient(61149, 'ec2-34-232-179-152.compute-1.amazonaws.com');
redisClient.auth("p39bd352fd76b783d2d7c31a1f68297dcf6094b36ebd0d81c581c0ae852ac5eaa");
const fixation = require('express-session-fixation');

var app = express();
app.use(fixation());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());

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

// 인증
const mustBe = require('mustbe');
const mustBeConfig = require('./mustbe-config');

mustBe.configure(mustBeConfig);

var index = require('./routes/index');
var users = require('./routes/users');
var campaign = require('./routes/campaign');

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
app.use('/campaign', campaign);

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

module.exports = app;
