const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-error');

function authMiddleware(req, res, next) {
  const token = req.cookies.jwt;
  if (!token) {
    return next(new UnauthorizedError('Токен авторизации отсутствует'));
  }
  try {
    const payload = jwt.verify(token, process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'dev-secret');
    req.user = payload;
    return next();
  } catch (error) {
    return next(new UnauthorizedError('Неверный токен'));
  }
}

module.exports = authMiddleware;
