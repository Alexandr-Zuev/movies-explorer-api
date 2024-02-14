const router = require('express').Router();
const { createMovieValidation, deleteMovieValidation } = require('../middlewares/validations');

const {
  getMovies, createMovie, deleteMovieById,
} = require('../controllers/movies');

router.get('/', getMovies);
router.post('/', createMovieValidation, createMovie);
router.delete('/:movieId', deleteMovieValidation, deleteMovieById);

module.exports = router;
