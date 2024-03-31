const mongoose = require('mongoose');
const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/forbidden-error');

const OK = 200;
const CREATED = 201;

async function getMovies(req, res, next) {
  try {
    const movies = await Movie.find({ owner: req.user._id });
    return res.status(OK).json(movies);
  } catch (err) {
    return next(err);
  }
}

async function createMovie(req, res, next) {
  try {
    const {
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
    } = req.body;
    const newMovie = new Movie({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
      owner: req.user._id,
    });
    await newMovie.validate();
    await newMovie.save();

    return res.status(CREATED).json(newMovie);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Некорректные данные при добавлении фильма'));
    }
    return next(err);
  }
}

async function deleteMovieById(req, res, next) {
  const { movieId } = req.params;
  const ownerId = req.user._id;
  if (!mongoose.Types.ObjectId.isValid(movieId)) {
    throw new BadRequestError('Удаление фильма с некорректным ID');
  }
  try {
    const movieToDelete = await Movie.findOne({ movieId: movieId, owner: ownerId });
    if (!movieToDelete) {
      throw new NotFoundError('Фильм с указанным ID не найден');
    }
    if (movieToDelete.owner.toString() !== req.user._id) {
      throw new ForbiddenError('Нельзя удалять фильмы других пользователей');
    }
    const deletedMovie = await Movie.findOneAndDelete({ movieId: movieId, owner: ownerId });
    if (!deletedMovie) {
      throw new NotFoundError('Ошибка удаления фильма');
    }
    return res.status(OK).json({ message: 'Фильм успешно удален' });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getMovies,
  createMovie,
  deleteMovieById,
};
