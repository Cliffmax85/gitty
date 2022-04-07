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

  .post('/', authenticate, async (req, res, next) => {
      try { 
        const geet = await Geet.insert(req.body);
      res.json(geet); 
      } catch (error) {
          next(error);
      }
  });