const crypto = require("crypto");
const generateCode = () => {
    const OTP = crypto.randomBytes(2);
    return OTP.toString('hex')
}

module.exports = {generateCode}