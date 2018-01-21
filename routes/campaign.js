var express = require('express');
var router = express.Router();

var db = require('../db');

let rowCount = 0;

const fields = [
    'ID',
    'TITLE',
    'DESCRIPTION',
    'MAINIMAGE',
    'DETAILIMAGES',
    'PRICE'
];

const fullFields = fields.concat([
    'REGDTTM',
    'MODDTTM',
    'STATUS'
]);

router.get('/list', function (req, res, next) {
    var model = {title: '책 정보 수정', id: req.query.campaignid, compaign: {}};

    const compaignFn = (message) => new Promise((resolve)=> {
        const query = `SELECT ${fullFields} FROM campaigns`;

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

router.get('/:campaignid', function (req, res, next) {
    var model = {title: '캠페인 수정', id: req.params.campaignid, compaign: {}};

    if (req.params.campaignid) {
        const compaignFn = (message) => new Promise((resolve)=> {
        const query = `SELECT ${fields} FROM campaigns WHERE id = '${req.params.campaignid}'`;

        db.connection.query(query, [],
            async function (err, result) {
                if (err) {
                    console.error(err.message);
                    return;
                }

                if (result.length === 1) {
                    // let index = 0;
                    // var resultMap = fields.reduce(function (x, y) {
                    //     x[y] = result[0][index++];
                    //     return x;
                    // }, {});

                    model["campaign"] = result[0];
                }
                resolve();
            });
        });

        (async function() {
            await compaignFn();
        })().then(() => {
            res.render('campaign', model);
        });
    } else {
        res.render('campaign', model);
    }
});

router.post('/modify', function (req, res, next) {
    const compaignFn = (message) => new Promise((resolve)=> {
        let setCommand = fields.reduce(function (x, y) {
            if(req.body[y] !== undefined) {
                x = x + (x === "" ? "" : ', ');
                x = x + y + " = Q'[" + req.body[y] + "]'";
            }
            return x;
        }, "");

        if(setCommand) {
            const query = `UPDATE compaigns SET ${setCommand}, MODDTTM = TO_CHAR(sysdate, 'YYYYMMDDHH24MISS') WHERE id = '${req.query.compaignid}'`;

            db.connection.query(query, [],
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
        const err = await compaignFn();
        if(!err) {
            res.redirect("/compaign/list")
        } else {
            res.status(500).send(err.message)
        }
    })();
});

router.post('/create', function (req, res, next) {
    const compaignFn = (message) => new Promise((resolve)=> {
        let values = fields.reduce(function (x, y) {
            x = x + (x === "" ? "" : ', ');
            return req.body[y] === undefined ? (x + 'NULL') : (x + "'" + req.body[y] + "'");
        }, "");

        if(values) {
            const query = `INSERT INTO campaigns(${fields}) VALUES (${values})`;

            db.connection.query(query, [],
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
        const err = await compaignFn();

        if(!err) {
            res.redirect("/compaign/list")
        } else {
            res.status(500).send(err.message)
        }
    })();
});

router.post('/delete', function (req, res, next) {

    const query = `UPDATE BK_campaigns SET SVCSTATUS = 0, SRCHSTATUS = 0, MODDTTM = TO_CHAR(sysdate, 'YYYYMMDDHH24MISS') WHERE id = '${req.body.compaignid}'` ;

    db.connection.execute(query , [],
        function (err, result) {
            if(err) {
                res.status(500).send(err.message)
            } else {
                res.redirect("/compaign/list")
            }
        });
});

module.exports = router;