
const userModel = require("../Models/Airtaxy.Model")
const { SendMail, forgotPasswordMail } = require("../Utilities/Mailer")
const { generateToken, VerifyToken } = require("../Sessionservice/Session")
const { generateCode } = require('../Config/code')
const { forgotPasswordModel } = require('../Models/Fogetpassword.model')
const bcrypt = require("bcryptjs")
const { response } = require("express")
const destinationModel = require("../Models/Destinations")
const { cloudinary } = require("../Config/Cloudinary")
const { hotelModel } = require("../Models/Hotel")
const { BookflightModel } = require("../Models/Bookflight.Model")

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


const getuser= async (request, response)=>{
    try {
        const get = await userModel.findOne({})
        return response.status(200).send({ get })
    } catch (error) {
        
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
        let token = request.headers.authorization
        token = token.split(" ")[1]
        const email = VerifyToken(token)
        console.log(token)
        response.status(200).send({ email })
    } catch (error) {
        console.log(error)
    }
}
const getHomepage = async (request, response) => {
    try {
        console.log(request.headers.authorization.split(" ")[1])
        //pass token to check email
        let token = request.headers.authorization.split(" ")[1]
        console.log(token);
        //check email from token
        const email = VerifyToken(token)
        console.log(email);
        //check the email if the person is a signed up user
        const user = await userModel.findOne({ email })
        console.log(user);
        if (!user) {
            return response.status(404).send({ message: "login your account", status: false })
        }
        return response.status(200).send({ token, message: "Welcome back" + user.email, status: true })
    } catch (error) {
        console.log(error);
    }
}

const bookflight = async (request, response) => {
    try {
        console.log(request.body)
        let { from, to, dates, passenger, classes } = request.body
        const token = request.headers.authorization?.split(" ")[1]
        console.log(token, "Test Test")
        const email = VerifyToken(token);
        const verifyUser = await userModel.findOne({ email: email })
        if (!verifyUser) return response.status(400).send({ message: "Bad request", status: false })
        console.log({destination_tbs},'');
        const locate = await destinationModel.find({ from: from , to: to })
        console.log(locate,'model');
        if (locate.length === 0) return response.status(404).send({ message: "Destination not found", status: false })

        const bookFlight = await BookflightModel.create({
            from,
            to,
            dates,
            passenger,
            classes,
            email: email
        })

        if(!bookFlight) return response.status(500).send({message:"FLight not booked"})
        return response.status(200).send({ message: "flight booked", status: true })
    } catch (error) {
        console.log(error)
    }
}

const getflight=async(request,response)=>{
    try {
        const get = await BookflightModel.findOne({})
        return response.status(200).send({ get })
    } catch (error) {
        
    }
}
const flightdelete = async(request,response)=>{
    try {
        console.log(request.body)
        let {upid} = request.body
        console.log(upid);
        const delet = await BookflightModel.findByIdAndDelete({_id:upid})
        if(!delet){
            response.status(500).send({message: "Flight not Cancelled", status: false})
        }
        return response.status(200).send({message: "Flight booked Cancelled", status: true})
    } catch (error) {
        
    }
}

const Summary = async (request, response, next) => {
    try {
        //pass token to check email
        let token = request.headers.authorization.split(" ")[1]
        console.log(token);
        //check email from token
        const email = VerifyToken(token)
        console.log(email, "111");
        //check the email if the person is a signed up user
        const user = await userModel.findOne({ email })
        console.log(user);
        if (!user) {
            return response.status(404).send({ message: "User does not exist", status: false })
        }
        
        const summary = await BookflightModel.findOne({email})
        console.log(summary,'summary');
        
        from = summary.from,
        to = summary.to
        classes = summary.classes
        console.log(from);
        console.log(classes,'to');
        const summaryCheck = await destinationModel.findOne({ 
            from: from, 
            to: to
            // classes: {class: classes}
        })
        //all classes details
        console.log(summaryCheck,'check');
        //all classes available
        console.log(summaryCheck.classes);
            // response.status(200).send({ summary,summaryCheck })
        //to find the classes that match with the classes the user booked
        const sekinat = summaryCheck.classes.find((cls)=>cls.class === classes)
        console.log(sekinat);
        // the number of seat available for that class
        console.log(sekinat.seat);
        //To find the number of seat picked by the user
        const seatPicked = await BookflightModel.countDocuments({
            classes:classes
        })
        console.log(seatPicked);
        // to check the totalavailable seat for tht classes
        const totalSeat = sekinat? sekinat.seat: 0
        console.log(totalSeat);
        // seat picked is lessthan or equals to total number of seat available
        if(seatPicked >= totalSeat){
            console.log(`All seat for ${classes} are booked`);
            return response.status(400).send({message:`All seat for ${classes} are booked`});
        }else{
            const availableSeat =  totalSeat - seatPicked
            console.log(`There are ${availableSeat} available seat for ${classes}`);
            // return response.status(200).send({message:`There are ${availableSeat} available seat for ${classes}`});
        }

        return response.status(200).send({ summary,summaryCheck })

    } catch (error) {
        next(error)
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
        const { file, to, from, classes, BusinessClass, EconomyClass, FirstClass, seat, seate, seatf, price, pricep, pricef } = request.body;
        console.log(request.body)
        const result = await cloudinary.uploader.upload(file)
        console.log(result)
        const { secure_url, public_id } = result
        const detail = {
            imageUrl: secure_url,
            public_id: public_id,
            to: to,
            from: from,
            // business: [business, seat,price] ,
            seat: seat,
            price: price,
            classes: [
                { class: BusinessClass, seat: seat, price: price },
                { class: EconomyClass, seat: seate, price: pricep },
                { class: FirstClass, seat: seatf, price: pricef }
            ],
            seate: seate,
            pricep: pricep,
            seatf: seatf,
            pricef: pricef,
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

const location = async (request, response, next) => {
    const { to, from, classes } = request.body
    console.log(to, "line 555");
    console.log(from, "line 456");
    console.log(classes, "line 456");
    try {
        const locate = await destinationModel.find({ to: to, from: from, classes: { classes } })
        console.log(locate, "line 566");
        if (!locate) {
            return response.status(402).send({ message: "Location not found", status: false })
        }
        return response.status(200).send({ message: "location found", status: true, locate })
    } catch (error) {
        console.error("Error in location query:", error);
        next(error)
    }
}

const seatnumber = async (request, response, next) => {
    try {
        
        const { seatnumber, _id } = request.body
        console.log(seatnumber);
        console.log(_id,'300');
         //pass token to check email
        let token = request.headers.authorization.split(" ")[1]
        console.log(token);
        //check email from token
        const email = VerifyToken(token)
        console.log(email, "111");
        //check the email if the person is a signed up user
        const user = await userModel.findOne({ email })
        console.log(user);
        if (!user) {
            return response.status(404).send({ message: "User does not exist", status: false })
        }
        const existingDetails = await BookflightModel.findById(_id)
        if(!existingDetails){
            return response.status(404).send({message: 'Details not found', status: false})
        }
        if (existingDetails.seatNumber && existingDetails.seatNumber.number === seatnumber) {
            return response.status(400).send({ message: 'Seat already picked by someone', status: false });
        }

        // const newseat = {number: seatnumber, status:'available'}
        // console.log(newseat);
         existingDetails.seatNumber = {number: seatnumber, status:'available'}
        // existingDetails.seatNumber= [{ seatnumber: number, status: 'available' }];
        const updatedDetails = await existingDetails.save()
        console.log(updatedDetails);
        //  response .status(200).send({ location:updatedDetails })
        const location = await BookflightModel.findByIdAndUpdate(
            {_id: _id},
            {$set: {seatnumber: seatnumber}},
            { new: true })
        return response.status(200).send({ location })
    } catch (error) {
        next(error)
    }
}

const personalInfo = async (request, response, next)=>{
    try {
        const {selectedimage, name, address, passport, dob, country, _id} =request.body;
        console.log(selectedimage,name, address, passport, dob, country, _id);
         //pass token to check email
         let token = request.headers.authorization.split(" ")[1]
         console.log(token);
         //check email from token
         const email = VerifyToken(token)
         console.log(email, "111");
         //check the email if the person is a signed up user
         const user = await userModel.findOne({ email })
         console.log(user);
         if (!user) {
             return response.status(404).send({ message: "User does not exist", status: false })
         }
         const existingDetails = await userModel.findById(_id)
         if(!existingDetails){
             return response.status(404).send({message: 'Details not found', status: false})
         }
         existingDetails.personalInformation= {name:name, address:address, passport:passport, dob:dob, country:country}
         const updatedDetails = await existingDetails.save()
        console.log(updatedDetails);
        const personal = await userModel.findByIdAndUpdate(
            {_id: _id},
            {$set: {selectedimage:selectedimage, name:name, address:address, passport:passport, dob:dob, country:country}},
            { new: true })
        return response.status(200).send({ personal })
    } catch (error) {
       console.log(error); 
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

module.exports = { RegisterUser,getuser, SignedUser, TokenVerification, bookflight,getflight, Summary,flightdelete,seatnumber,personalInfo, forgotPassword, verifyPassword, resetPassword, getHomepage, imageUpload, images, location, hotelUpload, hotels }