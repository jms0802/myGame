const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const fs = require('fs');
const path = require('path');

const envFile = process.env.NODE_ENV === 'product' ? '.env.product' : '.env.dev';
require('dotenv').config({ path: path.resolve(__dirname, '..', envFile) });


const connectDb = asyncHandler( async() => {
    try {
        const connect = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`DB Connected : ${connect.connection.host}`);
    } catch(err) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
});

module.exports = connectDb;