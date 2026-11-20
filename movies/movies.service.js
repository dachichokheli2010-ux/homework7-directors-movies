const moviesModel = require("./movies.model")
const directorsModel = require("../directors/directors.model")

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

exports.getAllMovies = async (req, res) => {
    const query = req.validated
    const filter = {}

    if(query.title){
        filter['title'] = {$regex: escapeRegex(query.title), $options: 'i'}
    }

    // ?genre=comedy -> only "Comedy" movies (exact match, any letter case)
    if(query.genre){
        filter['genre'] = {$regex: `^${escapeRegex(query.genre)}$`, $options: 'i'}
    }

    // ?year=2020 -> only movies released in 2020
    if(query.year !== undefined){
        filter['releaseYear'] = query.year
    } else {
        if(query.yearFrom !== undefined){
            filter['releaseYear'] = {...filter.releaseYear, '$gte': query.yearFrom}
        }

        if(query.yearTo !== undefined){
            filter['releaseYear'] = {...filter.releaseYear, '$lte': query.yearTo}
        }
    }

    if(query.director){
        filter['director'] = query.director
    }

    const page = query.page ?? 1
    const limit = query.limit ?? 10
    const skip = (page - 1) * limit

    const [movies, total] = await Promise.all([
        moviesModel.find(filter)
            .sort({ _id: 1 })
            .skip(skip)
            .limit(limit)
            .populate('director', 'fullName birthYear country'),
        moviesModel.countDocuments(filter)
    ])

    res.json({
        data: movies,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    })
}

exports.createMovie = async (req, res) => {
    const newMovie = await moviesModel.create({
        title: req.body.title,
        desc: req.body.desc,
        releaseYear: req.body.releaseYear,
        genre: req.body.genre,
        director: req.directorId
    })

    await directorsModel.findByIdAndUpdate(req.directorId, {
        $push: {movies: newMovie._id}
    })

    res.status(201).json(await newMovie.populate('director', 'fullName birthYear country'))
}

exports.getMovieById = async (req, res) => {
    const movie = await moviesModel.findById(req.params.id)
        .populate('director', 'fullName birthYear country')
    if(!movie){
        return res.status(404).json({success: false, message: "movie not found"})
    }
    res.json(movie)
}

exports.deleteMovieById = async (req, res) => {
    const movie = await moviesModel.findByIdAndDelete(req.params.id)
    if(!movie){
        return res.status(404).json({success: false, message: "movie not found"})
    }
    await directorsModel.findByIdAndUpdate(movie.director, {
        $pull: {movies: movie._id}
    })
    res.json(movie)
}

exports.updateMovieById = async (req, res) => {
    const movie = await moviesModel.findByIdAndUpdate(req.params.id, req.body, {new: true})
        .populate('director', 'fullName birthYear country')
    if(!movie){
        return res.status(404).json({success: false, message: "movie not found"})
    }
    res.json(movie)
}
