
const userModel = require("../Models/Airtaxy.Model")
const { SendMail, forgotPasswordMail } = require("../Utilities/Mailer")
const { generateToken, VerifyToken } = require("../Sessionservice/Session")
const { generateCode } = require('../Config/code')
const { forgotPasswordModel } = require('../Models/Fogetpassword.model')
const bcrypt = require("bcryptjs")
const { response } = require("express")
const { destinationModel } = require("../Models/Destinations")
const { cloudinary } = require("../Config/Cloudinary")
const { hotelModel } = require("../Models/Hotel")

const RegisterUser = async (request, response) => {
    const { email, password } = request.body
    try {
        const findUser = await userModel.findOne({ email })
        const mailer = await SendMail(email)
        if (mailer !== "Mail sent") {
            return response.status(500).send({ message: "Welcome mail not sent", status: false })
        }
        if (findUser) {
            response.status(400).send({ message: 'User is alredy a user' })
        }
        const userDetails = {
            email,
            password
        }

        await userModel.create(userDetails)
        response.status(200).send({ message: 'user signed up successfully', status: true, userDetails })
    } catch (error) {
        console.log(error);
    }
}

const SignedUser = async (request, response) => {
    try {
        // console.log(request.body)
        const { email, password } = request.body
        // console.log(password)

        const user = await userModel.findOne({ email })
        console.log(user);
        if (!user) {
            return response.status(404).send({ message: "You don't have an account signup", status: true })
        }
        // const signed = await userModel({email})
        // console.log(signed)
        // 
        // comparing user password
        const compare = await bcrypt.compare(password, user.password)
        if (!compare) {
            return response.status(404).send({ message: "Invalid details", status: false })
        }
        //creating token
        const emailToken = email
        const token = generateToken(emailToken)
        console.log(token)
        return response.status(200).send({ user, token, message: "Welcome user" + user.email })

    } catch (error) {
        console.log(error);
    }
}

const TokenVerification = async (request, response) => {
    try {
        const token = request.headers.authorization
        token = token.split(" ")[1]
        const email = VerifyToken(token)
        console.log(token)
        response.status(200).send({ email })
    } catch (error) {
        console.log(error)
    }
}

const forgotPassword = async (request, response, next) => {
    try {
        const { email } = request.body
        const OTP = generateCode()
        const user = await userModel.findOne({ email: email });
        if (!user) {
            return response.status(404).send({ message: "Account does not exist", status: false })
        }

        //   return response.status(200).send({ message: "Account found", status: true })
        await forgotPasswordMail(email, OTP)
        const forgotPassword = await forgotPasswordModel.create({
            email: email,
            OTP: OTP
        })
        response.status(201).send({ message: "Check your mail for password reset token", status: true, OTP })
    } catch (error) {
        next(error)
    }
}

const verifyPassword = async (request, response, next) => {
    try {
        const { email, OTP, password } = request.body;
        const findOTP = await forgotPasswordModel.findOne({ email: email, OTP: OTP })
        console.log(findOTP);
        if (!findOTP) {
            return response.status(404).send({ message: "Invalid OTP", status: false })
        }
        return response.status(200).send({ message: "OTP Confirmed", status: true })

        // const hashedPassword = await bcryptjs.hash(password, 10);
        // const update = await userModel.updateOne({ email: email }, { $set: { password: hashedPassword } })
        // if(!update.acknowledged) return response.status(500).send({message:"error updating password"})
        // response.status(204).send({message:"Password updated successfully"})
    } catch (error) {
        next(error)
    }
}

const resetPassword = async (request, response, next) => {
    try {
        const { email, OTP, password } = request.body;
        console.log(request.body)
        const findOTP = await forgotPasswordModel.findOne({ email: email, OTP: OTP })
        if (!findOTP) return response.status(404).send({ message: "OTP not created. Kindly create one", status: false })
        const hashedPassword = await bcrypt.hash(password, 10);
        const update = await userModel.updateOne({ email: email }, { $set: { password: hashedPassword } })
        if (!update.acknowledged) return response.status(500).send({ message: "error updating password" })
        const deleteForgotten = await forgotPasswordModel.deleteOne({ email: email })

        response.status(200).send({ message: "Password updated successfully" })
    } catch (error) {
        next(error)
    }
}

const imageUpload = async (request, response, next) => {
    try {
        const { file, location, business,economy,first,seat,seate,seatf,price,pricep,pricef } = request.body;
        console.log(request.body)
        const result = await cloudinary.uploader.upload(file)
        console.log(result)
        const { secure_url, public_id } = result
        const detail = { imageUrl: secure_url,
            public_id: public_id,
            location: location,
            // business: [business, seat,price] ,
            seat:seat,
            price:price,
            business: [business, seat,price] ,
            seate:seate,
            pricep:pricep,
            economy: [economy, seate,pricep],
            seatf:seatf,
            pricef:pricef,
            first: [first, seatf,pricef] 
            // business:{
            //     business:seat,
            //     business:price
            // },
            // economy: [economy, seat,price],
            // first: [first, seat,price] 
         }
        const saveImage = await destinationModel.create(detail)
        if (saveImage === null) {
            return response.status(500).send({ message: "Image upload failed", status: false })
        }
        return response.status(201).send({ message: "Image upload successful", status: true })

    } catch (error) {
        next(error)
    }
}

const images = async (request, response, next) => {
    try {
        const images = await destinationModel.find({})
        return response.status(200).send({ images })
    } catch (error) {
        next(error)
    }

}

const hotelUpload = async (request, response, next) => {
    try {
        const { file, hotels } = request.body;
        console.log(request.body)
        const result = await cloudinary.uploader.upload(file)
        console.log(result)
        const { secure_url, public_id } = result
        const saveImage = await hotelModel.create({ imageUrl: secure_url, public_id: public_id, hotels: hotels })
        if (saveImage === null) {
            return response.status(500).send({ message: "Image upload failed", status: false })
        }
        return response.status(201).send({ message: "Image upload successful", status: true })

    } catch (error) {
        next(error)
    }
}

const hotels = async (request, response, next) => {
    try {
        const images = await hotelModel.find({})
        return response.status(200).send({ images })
    } catch (error) {
        next(error)
    }

}

module.exports = { RegisterUser, SignedUser, TokenVerification, forgotPassword, verifyPassword, resetPassword, imageUpload, images, hotelUpload, hotels }