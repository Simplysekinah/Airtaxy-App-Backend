const nodemailer = require("nodemailer")
const dotenv = require("dotenv").config()

const SendMail = async(email)=>{
    const Email = process.env.EMAIL
    const Password = process.env.PASSWORD
    console.log(Email,Password)

    const htmlTemplate = `
        <div>
            <div>
                <h2>Message title: Welcome message</h2>
            </div>
            <ul>
                <li>Email: ${email}</li>
            </ul>
            <div>
                <p>Dear ${email},welcome to our app. We hope you have a nice time and trip.</p>
            </div>
        </div>
    `

    const transporter =nodemailer.createTransport({
        service:"gmail",
        auth:{
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    })

    const mailOption = {
        from: process.env.EMAIL,
        to:email,
        subject:"Welcome message",
        text:"Our App",
        html: htmlTemplate
    }

    try {
        await transporter.sendMail(mailOption)
        return "Mail sent"
    } catch (error) {
        throw {
            name: "MAILINGERROR",
            message: "Error sending mail",
            error
        }
    }
}

const forgotPasswordMail = async (email, OTP) => {
    // console.log(process.env.EMAIL, process.env.PASSWORD)
    const htmlTemplate = `
        <div>
            <div>
                <h2>Message title: Password reset message message</h2>
            </div>
            <ul>
                <li>Email: ${email}</li>
            </ul>
            <div>
                <p>Dear ${email}, kindly use this code ${OTP} to reset your password.</p>
            </div>
        </div>
    `
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    })
    const mailOption = {
        from: process.env.EMAIL,
        to: email,
        subject: "Password reset message",
        text: "OUR APP",
        html: htmlTemplate
    }
    try {
        await transporter.sendMail(mailOption)
        return "Mail sent"
    } catch (error) {
        throw {
            name: "MAILINGERROR",
            message: "Error sending mail",
            error
        }
    }
}

module.exports = {SendMail,forgotPasswordMail}