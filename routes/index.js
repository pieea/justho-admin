var express = require('express');
var router = express.Router();
const mustBe = require('mustbe').routeHelpers();

/* GET home page. */
router.get('/', mustBe.authenticated(), mustBe.authorized('admin'), function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
