const { Router } = require("express");
const MoviesService = require('./movies.service')
const validate = require("../middlewares/validate.middleware");
const CreateMovieDto = require("./dto/create-movie.dto");
const UpdateMovieDto = require("./dto/update-movie.dto");
const GetMoviesQueryDto = require("./dto/get-movies-query.dto");
const checkObjectIdInParamsMiddleware = require("../middlewares/check-object-id-in-params.middleware");
const checkDirectorIdInHeadersMiddleware = require("../middlewares/check-director-id-in-headers.middleware");
const rateLimiter = require("../middlewares/rate-limit.middleware");


const movieRouter = new Router()

movieRouter.get('/', validate(GetMoviesQueryDto, 'query'), MoviesService.getAllMovies)
movieRouter.post('/', rateLimiter({ limit: 10, windowMs: 60 * 1000, blockMs: 5 * 60 * 1000 }), checkDirectorIdInHeadersMiddleware, validate(CreateMovieDto), MoviesService.createMovie)
movieRouter.get('/:id', checkObjectIdInParamsMiddleware, MoviesService.getMovieById)
movieRouter.delete('/:id', checkObjectIdInParamsMiddleware, MoviesService.deleteMovieById)
movieRouter.put('/:id', checkObjectIdInParamsMiddleware, validate(UpdateMovieDto), MoviesService.updateMovieById)

module.exports = movieRouter
