const yup = require("yup")

const AirtaxyValidator =yup.object({
    email: yup
        .string("Email must be a string")
        .email("Email is valid")
        .required("Email is required"),

    password: yup
        .string("password must be a string")
        .min(6, "password must not be less than six character")
        .max(100, "password must not be greater than 100 character")
        .required("password is required")
        .matches(/^[a-zA-Z0-9]+$/, "password must contain only aphabets"),
})

module.exports = {AirtaxyValidator}