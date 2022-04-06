const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Geet = require('../models/Geet');

module.exports = Router()
  .get('/', authenticate, async (req, res, next) => {
      try {
          const geets = await Geet.getAll();
          res.json(geets);
      } catch (error) {
          next(error);
      }
  })