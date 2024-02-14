const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Вы отправили слишком много запросов, попробуйте снова позже.',
});

module.exports = limiter;
