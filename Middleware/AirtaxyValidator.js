const validate = (schema) => async (request, response, next) => {
    const body = request.body
    try {
        await schema.validate(body)
        next()
    } catch (error) {
        console.log(error)
        return response.status(400).send({ message: error.message, status: false })
    }
}

module.exports = { validate }