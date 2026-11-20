const { z } = require("zod");

const CreateDirectorDto = z.object({
    fullName: z
                .string('სახელი აუცილებელია')
                .trim()
                .min(3, 'მინიმალური ოდენობაა 3')
                .max(50, 'მაქსიმალურია 50')
                .regex(/^[\p{L}\s.-]+$/u, 'სახელი უნდა შეიცავდეს მხოლოდ ასოებს'),
    birthYear: z
                .number('დაბადების წელი უნდა იყოს რიცხვი')
                .int()
                .min(1850, 'მინიმალური წელია 1850')
                .max(new Date().getFullYear(), 'წელი არ შეიძლება იყოს მომავალში')
                .optional(),
    country: z
                .string()
                .trim()
                .min(2, 'მინიმალური ოდენობაა 2')
                .max(50, 'მაქსიმალურია 50')
                .optional()
})

module.exports = CreateDirectorDto
