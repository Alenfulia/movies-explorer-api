const movieRouter = require('express').Router();
const { createMovieValidation, removeMovieValidation } = require('../middlewares/validations');
const { getMovies, createMovie, removeMovie } = require('../controllers/movies');

movieRouter.get('/', getMovies);
movieRouter.post('/', createMovieValidation, createMovie);
movieRouter.delete('/:movieId', removeMovieValidation, removeMovie);

module.exports = movieRouter;
