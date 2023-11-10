const errorHandler = (error, request, response, next) => {
    console.log(error, 45)
    if (error.name === "MongoServerError") {
        if (error.code === 11000) {
            return response.status(400).send({ message: "Duplicate error key. Use unique details on signup", status: false })
        }
    } else if (error.name === "FailedTokenGenerationError") {
        return response.status(500).send({ message: error.message || "Internal server error", status: false })
    } else if (error.name === "FailedTokenVerificationError") {
        return response.status(400).send({ message: error.message || "Authentication error", status: false })
    }
    response.status(500).send({ message: "Internal Server error", status: false })
    next()
}

module.exports = {errorHandler}