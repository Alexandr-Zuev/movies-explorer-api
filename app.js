/* eslint-disable no-console */
require('dotenv').config();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const limiter = require('./middlewares/rateLimiter');
const errorHandler = require('./middlewares/errorHandler');
const { createUserValidation, loginValidation } = require('./middlewares/validations');
const { login, createUser } = require('./controllers/users');
const authMiddleware = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-error');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { DB_ADDRESS } = require('./config');

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

const options = {  
  origin: [    
    'http://localhost:3000',
    'http://localhost:3001',
    'http://zuev.nomoredomainswork.ru',
    'https://zuev.nomoredomainswork.ru',  
  ],  
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],  
  preflightContinue: false,  
  optionsSuccessStatus: 204,  
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],  
  credentials: true,
};

app.use(cors(options));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);
app.use(limiter);
app.post('/signin', loginValidation, login);
app.post('/signup', createUserValidation, createUser);
app.post('/signout', (req, res) => {
  res.clearCookie('jwt').send({ message: 'Пользователь вышел' });
});
app.use(authMiddleware);
app.use('/users', require('./routes/users'));
app.use('/movies', require('./routes/movies'));

app.use((req, res, next) => next(new NotFoundError('Страница не найдена')));

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);
