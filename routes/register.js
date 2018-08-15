var express = require('express');
var router = express.Router();
var User = require('../models/User');

router.get('/', function(req, res, next) {
    res.send('Express RESTful API');
  });

router.post('/', function (req, res, next) {
    console.log('trying to register a user')

    if (req.body.email === undefined || req.body.email === "") {
        res.json({ code: 101, message: "Debes incluir un email" })
        return
    }

    if (req.body.name === undefined || req.body.name === "") {
        res.json({ code: 102, message: "Debes incluir un nombre para el usuario" })
        return
    }

    if (req.body.password === undefined || req.body.password === "") {
        res.json({ code: 103, message: "Debes incluir una contraseña" })
        return
    }

    User.find({ email: req.body.email }, function (err, users) {
        if (err) res.json({ code: 100, message: err })
        if (users.length > 0) {
            res.json({ code: 100, message: "Lo sentimos, ya existe un usuario con dicho email" })
        } else {
            User.create(req.body, function (err, post) {
                if (err) res.json({ code: 100, message: err })
                res.json({code: 200, user: post});
            });
        }
    })
});

module.exports = router;