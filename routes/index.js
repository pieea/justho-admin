var express = require('express');
var router = express.Router();
const mustBe = require('mustbe').routeHelpers();

var db = require('../db');

const fullFields = db.campaignsFields.concat([
  'REGDTTM',
  'MODDTTM',
  'STATUS'
]);

router.get('/', mustBe.authenticated(), mustBe.authorized('admin'), function(req, res, next) {
  var model = {title: '목록', compaign: {}};

  const compaignFn = (message) => new Promise((resolve)=> {
    let query = `SELECT ${fullFields} FROM campaigns`
    if(req.query.all !== 'Y') {
      query += ' WHERE status = \'S\'';
    }

    db.connection.query(query, [],
      async function (err, result) {
      if (err) {
        console.error(err.message);
        return;
      }

      if (result.length > 0) {
        // var resultList = result.reduce(function (a, b) {
        //     let index = 0;
        //     var resultMap = fullFields.reduce(function (x, y) {
        //         x[y] = b[index++];
        //         return x;
        //     }, {});
        //
        //     a.push(resultMap);
        //     return a;
        // }, []);

        model["campaigns"] = result;
        resolve();
      }
    });
  });

  (async function() {
    await compaignFn();
  })().then(() => {
    res.render('index', model);
  });

});

module.exports = router;
