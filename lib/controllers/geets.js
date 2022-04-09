const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Geet = require('../models/Geet');

module.exports = Router()
  .get('/', authenticate, async (req, res, next) => {
    Geet.getAll()
      .then((geets) => res.send(geets))
      .catch((error) => next(error));
  })

  .post('/', authenticate, async (req, res, next) => {
    Geet.insert(req.body)
      .then((geet) => res.send(geet))
      .catch((error) => next(error));
  });