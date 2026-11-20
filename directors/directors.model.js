const { default: mongoose } = require("mongoose");

const directorSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    birthYear: {
        type: Number
    },
    country: {
        type: String
    },
    movies: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'movies',
        default: []
    }
}, {timestamps: true})

module.exports = mongoose.model('directors', directorSchema)
