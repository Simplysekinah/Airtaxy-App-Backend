const jsonwebtoken = require("jsonwebtoken")
const dotenv = require("dotenv").config()

const secretkey= process.env.SECRET_KEY

const generateToken=(email)=>{
    try {
        const token = jsonwebtoken.sign({email},secretkey,{expiresIn: "30d"})
        return token
    } catch (error) {
        console.log(error)
        throw{
            name:"FailedTokenGenerationError",
            message:"Failed to generate user token",
            error
        }
    }
}

const VerifyToken=(token)=>{
    try {
        const decodedToken =jsonwebtoken.verify(token,secretkey)
        console.log(decodedToken)
        const email =decodedToken.email
        return email
    } catch (error) {
        console.log(error)
        throw{
            name:"FailedTokenVerificationError",
            message:"Authentication error",
            error
        }
    }
}

module.exports={generateToken,VerifyToken}