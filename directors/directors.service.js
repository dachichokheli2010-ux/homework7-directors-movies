const directorsModel = require("./directors.model")
const moviesModel = require("../movies/movies.model")

exports.getAllDirectors = async (req, res) => {
    const filter = {}

    if(req.query.fullName){
        filter['fullName'] = {$regex: req.query.fullName, $options: 'i'}
    }

    if(req.query.country){
        filter['country'] = {$regex: req.query.country, $options: 'i'}
    }

    const page = Math.max(parseInt(req.query.page) || 1, 1)
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 30)
    const skip = (page - 1) * limit

    const [directors, total] = await Promise.all([
        directorsModel.find(filter)
            .sort({ _id: 1 })
            .skip(skip)
            .limit(limit)
            .populate('movies', 'title desc releaseYear genre'),
        directorsModel.countDocuments(filter)
    ])

    res.json({
        data: directors,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    })
}

exports.createDirector = async (req, res) => {
    const newDirector = await directorsModel.create({
        fullName: req.body.fullName,
        birthYear: req.body.birthYear,
        country: req.body.country
    })

    res.status(201).json(newDirector)
}

exports.getDirectorById = async (req, res) => {
    const director = await directorsModel.findById(req.params.id)
        .populate('movies', 'title desc releaseYear genre')
    if(!director){
        return res.status(404).json({success: false, message: "director not found"})
    }
    res.json(director)
}

exports.deleteDirectorById = async (req, res) => {
    const director = await directorsModel.findByIdAndDelete(req.params.id)
    if(!director){
        return res.status(404).json({success: false, message: "director not found"})
    }
    await moviesModel.deleteMany({director: director._id})
    res.json(director)
}

exports.updateDirectorById = async (req, res) => {
    const director = await directorsModel.findByIdAndUpdate(req.params.id, req.body, {new: true})
        .populate('movies', 'title desc releaseYear genre')
    if(!director){
        return res.status(404).json({success: false, message: "director not found"})
    }
    res.json(director)
}
