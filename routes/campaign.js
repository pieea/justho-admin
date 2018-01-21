var express = require('express');
var router = express.Router();

var db = require('../db');

let rowCount = 0;

const fields = [
    'ID',
    'TITLE',
    'DESCRIPTION',
    'MAINIMAGES',
    'DETAILIMAGES',
    'PRICE'
];

router.get('/', function (req, res, next) {
    var model = {title: '책 정보 수정', bookid: req.query.campaignid, compaign: {}};

    if (req.query.campaignid) {
        const compaignFn = (message) => new Promise((resolve)=> {
            const query = `SELECT ${fields} FROM BK_BOOK WHERE bookid = '${req.query.campaignid}'`;

        db.connection.execute(query, [],
            async function (err, result) {
                if (err) {
                    console.error(err.message);
                    return;
                }

                if (result.rows.length === 1) {
                    let index = 0;
                    var resultMap = fields.reduce(function (x, y) {
                        x[y] = result.rows[0][index++];
                        return x;
                    }, {});

                    model["book"] = resultMap;
                    resolve();
                }
            });
        });

        (async function() {
            await compaignFn();
        })().then(() => {
            res.render('book', model);
        });
    } else {
        res.render('book', model);
    }
});

router.post('/', function (req, res, next) {
    const compaignFn = (message) => new Promise((resolve)=> {
        let setCommand = fields.reduce(function (x, y) {
            if(req.body[y] !== undefined) {
                x = x + (x === "" ? "" : ', ');
                x = x + y + " = Q'[" + req.body[y] + "]'";
            }
            return x;
        }, "");

        if(setCommand) {
            const query = `UPDATE BK_BOOK SET ${setCommand}, MODDTTM = TO_CHAR(sysdate, 'YYYYMMDDHH24MISS') WHERE bookid = '${req.query.compaignid}'`;

            db.connection.execute(query, [],
                function (err, result) {
                    if (err) {
                        resolve(err);
                    } else {
                        resolve();
                    }
                });
        } else {
            resolve();
        }
    });


    (async function() {
        const err = await bookFn();

        if(!err) {
            await compaignFn();
            res.send("OK")
        } else {
            res.status(500).send(err.message)
        }
    })();
});

router.post('/delete', function (req, res, next) {

    const query = `UPDATE BK_BOOK SET SVCSTATUS = 0, SRCHSTATUS = 0, MODDTTM = TO_CHAR(sysdate, 'YYYYMMDDHH24MISS') WHERE bookid = '${req.body.compaignid}'` ;

    db.connection.execute(query , [],
        function (err, result) {
            if(err) {
                res.status(500).send(err.message)
            } else {
                res.send("OK");
            }
        });
});

module.exports = router;