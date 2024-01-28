const mongoose  = require("mongoose");

//// mongodb connection

const connectDB = async()=>{
    try{
        await mongoose.connect("mongodb://localhost:27017/amioDB");
        console.log("database connected successfully...");
    }catch(err){
        console.log(err);
    }
}

module.exports = connectDB;