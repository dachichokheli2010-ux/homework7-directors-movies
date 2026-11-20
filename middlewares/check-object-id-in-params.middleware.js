const { isValidObjectId } = require("mongoose")

module.exports = (req, res, next) => {
    const id = req.params.id
    if(!isValidObjectId(id)){
        return res.status(400).json({
            success: false,
            message: "Wrong Id provided"
        })
    }

    next()
}