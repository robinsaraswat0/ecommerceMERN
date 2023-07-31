const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({

    name:{
        type:String,
        required:[true,"Please Enter Your Name"],
        maxlength:[30,"Name cannot exceed 30 characters"],
        minlength:[4,"Name should have more than 4 characters"]
    },
    email: {
        type:String,
        required:[true,"Please Enter Your Email"],
        unique:true,
        validate:[validator.isEmail,"Please Enter a valid Email"]
    },
    password : {
        type:String,
        required:[true,"Please Enter Your Password"],
        minlength:[8,"Password should have more than 8 characters"],
        select:false, // it is used to prevent the password from showing along with other details using 'find' method.
    },
    avatar:  {
        public_id:{
            type: String,
            required: true
        },
        url:{
            type: String,
            required: true
        }
    },
    role:{
        type:String,
        default: "user",
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date
});

userSchema.pre("save", async function(next){

    if(!this.isModified("password")){ // this is used to prevent the password from again hashing itself while we update the user data.
        next();
    }

    this.password = await bcrypt.hash(this.password,10);
})

// JWT Token -- to make sure its same user

userSchema.methods.getJWTToken = function(){
    return jwt.sign({id: this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
    });
};

// Compare Password

userSchema.methods.comparePassword = async function(enteredPassword){

    return await bcrypt.compare(enteredPassword,this.password);

};

// Generating Password Reset Token

userSchema.methods.getRestPasswordToken = function(){

    //Generating Token
    const resetToken = crypto.randomBytes(20).toString("hex"); //here 'hex' is format which is used to convert buffer value.

    //Hashing and add to userSchema
    this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

    this.resetPasswordExpire = Date.now() + 15*60*1000; // time for token to get expire is 15mins.

    return resetToken;
}

module.exports = new mongoose.model("User",userSchema);