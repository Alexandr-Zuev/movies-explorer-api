/* eslint-disable no-console */
require('dotenv').config();
const path = require('path');
const express = require('express');
const { celebrate, Joi } = require('celebrate');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const { login, createUser } = require('./controllers/users');
const authMiddleware = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-error');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { DB_ADDRESS } = require('./config');

const errorHandler = (err, req, res, next) => {
  console.log(err.status);
  const statusCode = err.status || 500;
  const message = statusCode === 500 ? 'На сервере произошла ошибка' : err.message;

  res.status(statusCode).send({ message });

  next();
};

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

const { PORT = 3000 } = process.env;
const app = express();

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

mongoose.connect(DB_ADDRESS);
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Ошибка подключения к MongoDB:'));
db.once('open', () => {
  console.log('Успешное подключение к MongoDB');
});

app.use(cors({
  origin: ['http://localhost:3001', 'https://zuev.nomoredomainsmonster.ru'],
  credentials: true,
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.post('/signin', loginValidation, login);
app.post('/signup', createUserValidation, createUser);
app.use(authMiddleware);
app.use('/users', require('./routes/users'));
app.use('/movies', require('./routes/movies'));

app.use((req, res, next) => next(new NotFoundError('Страница не найдена')));

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);
