const { ErrorCodes } = require("./errorCodes")

/**
 * @type {import("express").ErrorRequestHandler}
 */

const errorHandler = (error, req, res, next) => {
    console.log(error.cause)

    switch (error.code){
        case ErrorCodes.INVALID_TYPES_ERROR:
            console.log("ERROR CODE SWITCH => ", error.code)
            res.status(400).json({status: "Error", error: error.name, cause: error.cause})
            break
        
        case ErrorCodes.DATABASE_ERROR:
            console.log("ERROR CODE SWITCH => ", error.code)
            res.status(500).json({status: "Error", error: error.name, cause: error.cause})
            break
        
        case ErrorCodes.ROUTING_ERROR:
            console.log("ERROR CODE SWITCH => ", error.code)
            res.status(500).json({status: "Error", error: error.name, cause: error.cause})
            break

        case ErrorCodes.UNAUTHORIZED:
            console.log("ERROR CODE SWITCH => ", error.code)
            res.status(401).json({status: "Error", error: error.name, cause: error.cause})
            break
        
        default:
            console.log("ERROR CODE SWITCH => ", error.code)
            res.status(500).json({status: "Error", error: error.name, cause: error.cause})
            break
    }
    next() 
}

module.exports = { errorHandler }