const { Router } = require("express");
const DirectorsService = require('./directors.service');
const validate = require("../middlewares/validate.middleware");
const CreateDirectorDto = require("./dto/create-director.dto");
const UpdateDirectorDto = require("./dto/update-director.dto");
const checkObjectIdInParamsMiddleware = require("../middlewares/check-object-id-in-params.middleware");
const rateLimiter = require("../middlewares/rate-limit.middleware");


const directorRouter = new Router()

directorRouter.get('/', DirectorsService.getAllDirectors)
directorRouter.post('/', rateLimiter({ limit: 10, windowMs: 60 * 1000, blockMs: 5 * 60 * 1000 }), validate(CreateDirectorDto), DirectorsService.createDirector)
directorRouter.get('/:id', checkObjectIdInParamsMiddleware, DirectorsService.getDirectorById)
directorRouter.delete('/:id', checkObjectIdInParamsMiddleware, DirectorsService.deleteDirectorById)
directorRouter.put('/:id', checkObjectIdInParamsMiddleware, validate(UpdateDirectorDto), DirectorsService.updateDirectorById)

module.exports = directorRouter
