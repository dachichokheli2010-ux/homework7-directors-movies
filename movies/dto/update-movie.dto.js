const CreateMovieDto = require("./create-movie.dto");

const UpdateMovieDto = CreateMovieDto
    .partial()
    .refine(data => Object.keys(data).length > 0, {
        message: 'მინიმუმ ერთი ველი უნდა გადმოეცეს'
    })

module.exports = UpdateMovieDto
