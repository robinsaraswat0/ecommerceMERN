const app = require("./app");
const path = require("path");
const cloudinary = require("cloudinary");
// const dotenv = require("dotenv");
const connectDatabase = require("./config/database");

// Handling Uncaught Exception
process.on("uncaughtException",(err) => {
    console.log(`Error: ${err}`);
    console.log('Shutting the server due to UnCaught Exception');
    process.exit(1); // to get exit
})

//config

if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({ path: "./config/config.env" });
  }

//connecting to database

console.log(process.env.PORT)
connectDatabase();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const server = app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

// Unhandled Promise Rejection
process.on("unhandledRejection",err=>{
    console.log(`Error: ${err.message}`);
    console.log('Shutting the server due to UnHandled Promise Rejection');

    server.close(() => {
        process.exit(1);
    });
});