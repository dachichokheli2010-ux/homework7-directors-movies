const { default: mongoose } = require("mongoose")
const db = require('./config/db')
const directorsModel = require('./directors/directors.model')
const moviesModel = require('./movies/movies.model')

const data = [
    {
        director: { fullName: 'Christopher Nolan', birthYear: 1970, country: 'UK' },
        movies: [
            { title: 'Inception', desc: 'A thief who steals secrets through dreams', releaseYear: 2010, genre: 'Sci-Fi' },
            { title: 'Interstellar', desc: 'Explorers travel through a wormhole in space', releaseYear: 2014, genre: 'Sci-Fi' },
            { title: 'The Dark Knight', desc: 'Batman faces the Joker in Gotham', releaseYear: 2008, genre: 'Action' }
        ]
    },
    {
        director: { fullName: 'Quentin Tarantino', birthYear: 1963, country: 'USA' },
        movies: [
            { title: 'Pulp Fiction', desc: 'Intertwined stories of LA criminals', releaseYear: 1994, genre: 'Crime' },
            { title: 'Django Unchained', desc: 'A freed slave sets out to rescue his wife', releaseYear: 2012, genre: 'Western' }
        ]
    },
    {
        director: { fullName: 'Denis Villeneuve', birthYear: 1967, country: 'Canada' },
        movies: [
            { title: 'Dune', desc: 'A noble family fights for a desert planet', releaseYear: 2021, genre: 'Sci-Fi' },
            { title: 'Arrival', desc: 'A linguist communicates with alien visitors', releaseYear: 2016, genre: 'Drama' }
        ]
    }
]

const seed = async () => {
    await db()

    await moviesModel.deleteMany()
    await directorsModel.deleteMany()

    for (const item of data) {
        const director = await directorsModel.create(item.director)
        const movies = await moviesModel.insertMany(
            item.movies.map(movie => ({ ...movie, director: director._id }))
        )
        await directorsModel.findByIdAndUpdate(director._id, {
            $push: { movies: { $each: movies.map(m => m._id) } }
        })
        console.log(`${director.fullName} - ${movies.length} movies`)
    }

    await mongoose.disconnect()
}

seed()
