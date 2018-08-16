var express = require('express');
var router = express.Router();
var Event = require('../models/Event');

/* Obtener todos los eventos de un usuario */
router.get('/byuser/:userid', function (req, res, next) {
  Event.find({ user_id: req.params.userid }, function (err, events) {
    if (err) res.json({ code: 100, message: err })
    else res.json({ code: 200, events: events })
  })
});


/* Obtener un evento único */
router.get('/:id', function(req, res, next) {
  Event.findById(req.params.id, function (err, post) {
    if (err) res.json({code: 400, message: err});
    else if (post === null){
      res.json({code:100, message: "Event not found"});
    }
    else res.json({code:200, event: post});
  });
});

/* Crear un evento */
router.post('/', function(req, res, next) {
  Event.create(req.body, function (err, post) {
    if (err) res.json({code: 400, message: "No fue posible crear el evento"});
    else res.json({code: 200, event: post});
  });
});

/* Actualizar un evento */
router.put('/:id', function(req, res, next) {
  Event.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) res.json({code: 400, message: "No fue posible actualizar el evento"});
    else res.json({code: 200, event: post});
  });
});

/* Eliminar un evento */
router.delete('/:id', function(req, res, next) {
  Event.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) res.json({code: 400, message: "No fue posible eliminar el evento"});
    else res.json({code: 200, event: post});
  });
});

module.exports = router;