const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

//Register a User
exports.registerUser = catchAsyncError( async(req,res,next) => {
    // console.log(req.body);
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
        folder: "avatars",
        width: 150,
        crop: "scale",
    }).catch((e)=>{
        console.log(e);
    })


    const {name,email,password} = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar:{
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        },
    });

    sendToken(user, 201,res);
});


// Login User

exports.loginUser = catchAsyncError(async (req,res,next) =>{

    const {email,password} = req.body;

    //checking if user has given password and email both

    if(!email || !password){
        return next(new ErrorHandler("Please Enter Email and Password",400))
    }

    const user = await User.findOne({email}).select("+password"); // we define password in select because in UserSchema we make it as false.

    if(!user){
        return next(new ErrorHandler("Invalid Email or Password",401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Email or Password",401));
    }

    sendToken(user, 200,res);
});

// Logout User
exports.logout = catchAsyncError( async(req,res,next)=>{

    res.cookie("token",null,{
        expires: new Date(Date.now()),
        httpOnly:true
    })

    res.status(200).json({
        success:true,
        message:"Logout Successfully"
    })
})

// Forgot Password
exports.forgotPassword = catchAsyncError(async(req,res,next)=>{

    const user = await User.findOne({email: req.body.email});

    if(!user){
        return next(new ErrorHandler("User not Found",404));
    }

    //Get ResetPassword Token
    const resetToken = user.getRestPasswordToken();

    await user.save({validateBefoeSave:false});

    // const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;


    const message = `Your Password reset token is :- \n\n ${resetPasswordUrl} \n\n If you have not requested this email
    then, Please ignore it`;

    try {

        await sendEmail({

            email:user.email,
            subject:`Ecommerce Password Recovery`,
            message,

        });

        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email} successfully`
        })
        
    } catch (error) {
        user.resetPasswordToken = undefined; // we making this undefined because we already saved the resetToken in our Database and here request failed so we need to reset fields.
        user.resetPasswordExpire = undefined;

        await user.save({validateBefoeSave:false});

        return next(new ErrorHandler(error.message,500));
    }
});

//Reset Password
exports.resetPassword = catchAsyncError(async(req,res,next)=>{

    //creating Token Hash
    const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {$gt: Date.now()}
    });

    if(!user){
        return next(new ErrorHandler("Reset Password Token is invalid or has been expired",404));
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("Password Doesnt match",400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined; // we making this undefined because we already saved the resetToken in our Database and here request failed so we need to reset fields.
    user.resetPasswordExpire = undefined;

    await user.save();
    sendToken(user,200,res);

});


//Get user Details
exports.getUserDetails = catchAsyncError(async(req,res,next) => {

    const user = await User.findById(req.user.id); //Actually req.user defined in Auth file. Both are imported to userRoute.

    res.status(200).json({
        success:true,
        user
    })

});

//Update user Password
exports.updatePassword = catchAsyncError(async(req,res,next) => {

    const user = await User.findById(req.user.id).select("+password"); //Actually req.user defined in Auth file. Both are imported to userRoute.

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Old Password is Incorrect",401));
    }

    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler("Password Does not Match",401));
    }

    user.password = req.body.newPassword;

    await user.save();

    sendToken(user,200,res);

});

//Update User Profile
exports.updateProfile = catchAsyncError(async(req,res,next) => {

    const newUserData = {
        name:req.body.name,
        email:req.body.email
    };

    if(req.body.avatar !== "") {
        const user = await User.findById(req.user.id);

        const imageId = user.avatar.public_id;

        await cloudinary.v2.uploader.destroy(imageId);

        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
            folder: "avatars",
            width: 150,
            crop: "scale",
        })

        newUserData.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        }
    }

    const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });

    res.status(200).json({
        success:true
    });


    sendToken(user,200,res);

});

//Get All Users(admin)
exports.getAllUser = catchAsyncError(async(req,res,next) =>{

    const users = await User.find();

    res.status(200).json({
        success:true,
        users
    });
});

//Get Single Users(admin)
exports.getSingleUser = catchAsyncError(async(req,res,next) =>{

    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User Doesnt Exist with ID:${req.params.id}`));
    }

    res.status(200).json({
        success:true,
        user
    });
});


//Update User Role (admin)
exports.updateUserRole = catchAsyncError(async(req,res,next) => {

    const newUserData = {
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    };

    await User.findByIdAndUpdate(req.params.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });

    res.status(200).json({
        success:true
    });


    sendToken(user,200,res);

});

// Delete User Role (admin)
exports.deleteUser = catchAsyncError(async(req,res,next) => {

    const user = await User.findById(req.params.id);

    
    if(!user){
        return next(new ErrorHandler(`User Doesnt Exist with ID: ${req.params.id}`,404));
    }

    const imageId = user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(imageId);
    await user.remove();

    res.status(200).json({
        success:true,
        message:"User Deleted Successfully"
    });

});
