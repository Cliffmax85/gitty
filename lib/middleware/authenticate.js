const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    console.log('COOKIE NAME\\\\', [process.env.COOKIE_NAME]);
    try {
        const cookie = req.cookies[process.env.COOKIE_NAME];
console.log('////cookie/////', cookie);
        if (!cookie) throw new Error('You must be signed in to continue');

        const user = jwt.verify(cookie, process.env.JWT_SECRET);
        req.user = user;

        next();
    } catch (error) {
        error.status = 401;
        next(error);
    }
}