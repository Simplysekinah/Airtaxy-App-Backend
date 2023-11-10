const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

let userSchema= new mongoose.Schema({
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true}
})

let saltround = 10
userSchema.pre("save",function(next){
    console.log(this.password)
    bcrypt.hash(this.password,saltround).then((harshedpassword)=>{
        console.log(harshedpassword)
        this.password=harshedpassword
        next()
    }).catch((error)=>{
        console.log(error)
    })
})

userSchema.methods.Validatepassword = function(password,callback){
    console.log(password)
    console.log(this)
    bcrypt.compare(password,this.password).then((samepassword,error)=>{
        if(!error){
            callback(samepassword,error)
        }
        else{
            next()
        }
    }).catch((error)=>{
        console.log(error);
    })
}
let userModel =mongoose.model("signup Collection",userSchema)

module.exports = userModel