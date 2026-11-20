const moviesModel = require("./movies.model")
const directorsModel = require("../directors/directors.model")

exports.getAllMovies = async (req, res) => {
    const filter = {}

    if(req.query.title){
        filter['title'] = {$regex: req.query.title, $options: 'i'}
    }

    if(req.query.genre){
        filter['genre'] = {$regex: req.query.genre, $options: 'i'}
    }

    if(req.query.yearFrom){
        filter['releaseYear'] = {...filter.releaseYear, '$gte': req.query.yearFrom}
    }

    if(req.query.yearTo){
        filter['releaseYear'] = {...filter.releaseYear, '$lte': req.query.yearTo}
    }

    if(req.query.director){
        filter['director'] = req.query.director
    }

    const page = Math.max(parseInt(req.query.page) || 1, 1)
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 30)
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
