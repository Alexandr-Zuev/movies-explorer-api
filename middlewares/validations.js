const { celebrate, Joi } = require('celebrate');

const createUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const createMovieValidation = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().regex(/^https?:\/\/\S+\.(jpg|jpeg|png|gif)$/).required(),
    trailerLink: Joi.string().regex(/^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|vimeo\.com\/).+$/).required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().regex(/^https?:\/\/\S+\.(jpg|jpeg|png|gif)$/).required(),
    movieId: Joi.number().required(),
  }),
});

const deleteMovieValidation = celebrate({
  params: Joi.object().keys({
    movieId: Joi.number().integer().positive().required(),
  }),
});

const updateProfileValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    name: Joi.string().min(2).max(30).required(),
  }),
});

module.exports = {
  createUserValidation,
  loginValidation,
  createMovieValidation,
  deleteMovieValidation,
  updateProfileValidation,
};
