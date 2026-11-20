const { Router } = require("express");
const MoviesService = require('./movies.service')
const validate = require("../middlewares/validate.middleware");
const CreateMovieDto = require("./dto/create-movie.dto");
const UpdateMovieDto = require("./dto/update-movie.dto");
const checkObjectIdInParamsMiddleware = require("../middlewares/check-object-id-in-params.middleware");
const checkDirectorIdInHeadersMiddleware = require("../middlewares/check-director-id-in-headers.middleware");


const movieRouter = new Router()

movieRouter.get('/', MoviesService.getAllMovies)
movieRouter.post('/', checkDirectorIdInHeadersMiddleware, validate(CreateMovieDto), MoviesService.createMovie)
movieRouter.get('/:id', checkObjectIdInParamsMiddleware, MoviesService.getMovieById)
movieRouter.delete('/:id', checkObjectIdInParamsMiddleware, MoviesService.deleteMovieById)
movieRouter.put('/:id', checkObjectIdInParamsMiddleware, validate(UpdateMovieDto), MoviesService.updateMovieById)

module.exports = movieRouter
