const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,"Please Enter Product Name"],
        minlength: 3,
        trim: true
    },
    description : {
        type: String,
        required:[true,"Please Enter Product Description"]
    },
    price: {
        type: Number,
        required: [true,"Please Enter Product Price"],
        maxlength: [8,"Price cannot exceed 8 Figures"]
    },
    ratings:{
        type: Number,
        default: 0
    },
    images: [
        {
            public_id:{
                type: String,
                required: true
            },
            url:{
                type: String,
                required: true
            }
        }
    ],
    category: {
        type: String,
        required:[true,"Please Enter Product Category"]
    },
    stock :{
        type: Number,
        required:[true,"Please Entert Product Stock"],
        maxlength:[4,"Stock cannot exceed 4 Figures"],
        default : 1
    },
    numOfReviews: {
        type: Number,
        default: 0 
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.ObjectId,
                ref:"User",
                required:true
            },
            name:{
                type:String,
                required: true
            },
            rating: {
                type: Number,
                required: true,
                default: 0
            },
            comment : {
                type: String,
                required: true
            }
        }
    ],

    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const product = new mongoose.model("Product",productSchema);

module.exports = product;