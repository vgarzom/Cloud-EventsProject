var express = require('express');
var router = express.Router();
var User = require('../models/User');

router.get('/', function(req, res, next) {
    res.send('Please use post');
  });

router.post('/', function (req, res, next) {
    console.log('trying to login a user')

    if (req.body.email === undefined || req.body.email === "") {
        res.json({ code: 101, message: "Debes incluir un email" })
        return
    }

    if (req.body.password === undefined || req.body.password === "") {
        res.json({ code: 103, message: "Debes incluir una contraseña" })
        return
    }

    User.find({ email: req.body.email, password: req.body.password }, function (err, users) {
        if (err) res.json({ code: 100, message: err })
        if (users.length > 0) {
            res.json({ code: 200, user: users[0] })
        } else {
            res.json({ code: 400, message: "Correo o contraseña incorrectos"})
        }
    })
});

module.exports = router;