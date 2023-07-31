const Order = require("../models/orderModel");
const catchAsyncError = require("../middleware/catchAsyncErrors");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");

//Create New Order
exports.newOrder = catchAsyncError(async(req,res,next)=>{
    const {shippingInfo,orderItems,paymentInfo,itemsPrice,taxPrice,shippingPrice,totalPrice} = req.body;
    // console.log(req.body);

    const order = await Order.create({shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt:Date.now(),
        user: req.user._id
    });

    res.status(201).json({
        success:true,
        order
    });
});

//Get single Order
exports.getSingleOrder = catchAsyncError(async(req,res,next) =>{
    const order = await Order.findById(req.params.id).populate("user","name email");  // here Populate is to find the name email of the user which is associated with the order.

    if(!order){
        return next(new ErrorHandler("Order not found",404));
    }

    res.status(201).json({
        success:true,
        order
    })
})

//Get logged in user Order
exports.myOrders = catchAsyncError(async(req,res,next) =>{
    const orders = await Order.find({user:req.user._id});

    res.status(201).json({
        success:true,
        orders
    })
});

//Get All Orders -- Admin
exports.getAllOrders = catchAsyncError(async(req,res,next)=>{
    const orders = await Order.find();

    let totalAmount =0;
    orders.forEach((order)=>{
        totalAmount += order.totalPrice;
    });

    res.status(201).json({
        success:true,
        totalAmount,
        orders
    })
})

//Update Order Status -- Admin
exports.updateOrder = catchAsyncError(async(req,res,next)=>{
    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler("Order not Found",404));
    }

    if(order.orderStatus === "Delivered"){
        return next(new ErrorHandler("You have already delivered this Order",404));
    }

    order.orderItems.forEach(async(order)=>{

        await updateStock(order.product,order.quantity);

    });

    order.orderStatus = req.body.status;

    if(req.body.status ==="Delivered"){

        order.deliveredAt = Date.now();

    }

    await order.save({validateBeforeSave:false});

    res.status(201).json({
        success:true,
        order
    });
});

async function updateStock(id,quantity){  // this is used to update the stock in Prodcut Model
    const product = await Product.findById(id);

    product.stock -= quantity;

    await product.save({validateBeforeSave:false});
};


//Delete Order -- Admin
exports.deleteOrder = catchAsyncError(async(req,res,next)=>{
    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler("Order not Found",404));
    }

    await order.remove();

    res.status(201).json({
        success:true,
    })
})