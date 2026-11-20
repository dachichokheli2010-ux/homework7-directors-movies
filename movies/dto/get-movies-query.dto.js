const { z } = require("zod");
const { isValidObjectId } = require("mongoose");

const year = z.coerce
    .number('წელი უნდა იყოს რიცხვი')
    .int('წელი უნდა იყოს მთელი რიცხვი')

const GetMoviesQueryDto = z.object({
    title: z.string().trim().optional(),
    genre: z.string().trim().optional(),
    year: year.optional(),
    yearFrom: year.optional(),
    yearTo: year.optional(),
    director: z
            .string()
            .refine(isValidObjectId, 'რეჟისორის id არასწორია')
            .optional(),
    page: z.coerce.number().int().min(1, 'მინიმალური გვერდია 1').optional(),
    limit: z.coerce.number().int().min(1, 'მინიმუმ 1').max(30, 'მაქსიმუმ 30').optional()
})

module.exports = GetMoviesQueryDto
