const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secretKey = process.env.KEY;

const userSchema = new mongoose.Schema({
    fname:{
        type:String,
        required:true,
        trim:true
    },
     email:{
        type:String,
        required:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("not valid em ail address");
            }
        }
     },
     mobile:{
        type:String,
        required:true,
        unique:true,
        maxlenght:10
     },
     password:{
        type:String,
        required:true,
        minlenght:6
     },
     cpassword:{
        type:String,
        required:true,
        minlenght:6
     },
     tokens : [
        {
            token: {
                type:String,
                required:true,
            }
        }
     ],
     carts : Array
});

userSchema.pre("save", async function(next){
    if(this.isModified("password")){
    this.password = await bcrypt.hash(this.password,12);
    this.cpassword = await bcrypt.hash(this.cpassword,12);
}
  next();
})


userSchema.methods.generateAuthtoken = async function(){
    try{
        let tokenPro = jwt.sign({_id:this._id},secretKey);
        this.tokens = this.tokens.concat({token:tokenPro});
        await this.save();
        return tokenPro;
    }
    catch(error){
    console.log(error);
    }
}

const USER = new mongoose.model("USER",userSchema);

module.exports = USER;


