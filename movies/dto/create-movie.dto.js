const { z } = require("zod");

const CreateMovieDto = z.object({
    title: z
            .string('სათაური აუცილებელია')
            .trim()
            .min(1, 'სათაური ცარიელია')
            .max(100, 'მაქსიმალურია 100'),
    desc: z
            .string('აღწერა აუცილებელია')
            .trim()
            .min(5, 'მინიმალური ოდენობაა 5')
            .max(1000, 'მაქსიმალურია 1000'),
    releaseYear: z
            .number('გამოსვლის წელი უნდა იყოს რიცხვი')
            .int()
            .min(1888, 'მინიმალური წელია 1888')
            .max(new Date().getFullYear() + 5, 'წელი ძალიან შორეულია')
            .optional(),
    genre: z
            .string()
            .trim()
            .min(2, 'მინიმალური ოდენობაა 2')
            .max(30, 'მაქსიმალურია 30')
            .optional()
})

module.exports = CreateMovieDto
