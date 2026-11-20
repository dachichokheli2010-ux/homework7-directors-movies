const { default: mongoose } = require("mongoose");

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    releaseYear: {
        type: Number
    },
    genre: {
        type: String
    },
    director: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'directors'
    }
}, {timestamps: true})

module.exports = mongoose.model('movies', movieSchema)
