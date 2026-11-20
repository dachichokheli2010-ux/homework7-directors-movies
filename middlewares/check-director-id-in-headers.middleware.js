const { isValidObjectId } = require("mongoose")
const directorsModel = require("../directors/directors.model")

module.exports = async (req, res, next) => {
    const directorId = req.headers['director-id']
    if(!directorId){
        return res.status(400).json({
            success: false,
            message: "director-id header is required"
        })
    }

    if(!isValidObjectId(directorId)){
        return res.status(400).json({
            success: false,
            message: "Wrong director id provided"
        })
    }

    const director = await directorsModel.exists({_id: directorId})
    if(!director){
        return res.status(404).json({
            success: false,
            message: "director not found"
        })
    }

    req.directorId = directorId
    next()
}
