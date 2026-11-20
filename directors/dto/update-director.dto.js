const CreateDirectorDto = require("./create-director.dto");

const UpdateDirectorDto = CreateDirectorDto
    .partial()
    .refine(data => Object.keys(data).length > 0, {
        message: 'მინიმუმ ერთი ველი უნდა გადმოეცეს'
    })

module.exports = UpdateDirectorDto
