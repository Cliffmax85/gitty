const { Router } = require('express');
const jwt = require('jsonwebtoken');
const GithubUser = require('../models/GithubUser');
const { exchangeCodeForToken, getGithubProfile } = require('../utils/github');


module.exports = Router()
  .get('/login', async (req, res) => {
      res.redirect(
          `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=user&redirect_uri=http://localhost:7890/api/v1/github/login/callback`
      );
  })

  .get('/login/callback', async (req, res, next) => {
    try {
        const { code } = req.query;

        const token = await exchangeCodeForToken(code);

        const profile = await getGithubProfile(token);

        let user = await GithubUser.getByUsername(profile.login);

        if (!user) {
            user = await GithubUser.insert({
                username: profile.login,
                avatar: profile.avatar_url,
                email: profile.email
            });
        }

        const payload = jwt.sign(user.toJSON(), process.env.JWT_SECRET, { expiresIn: '1 day'});

        res
          .cookie(process.env.COOKIE_NAME, payload, {
              httpOnly: true,
              maxAge: 1000 * 60 * 60 * 24
          })
          .redirect('/api/v1/posts');
    } catch (error) {
        next(error)
    }
  })
  
  .delete('/', async (req, res) => {
      res
        .clearCookie(process.env.COOKIE_NAME)
        .json({ success: true, message: 'You have logged out'});
  });

