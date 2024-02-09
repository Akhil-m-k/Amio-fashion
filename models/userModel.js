/// loading mongoose
const mongoose = require("mongoose");

////schema for signUp 
const userSchema = new mongoose.Schema({
    fname:{
        type:String,
        required:[true,"firstName is required"]
    },
    lname:{
        type:String,
        required:[true,"lastName is required"]
    },
    email:{
        type:String,
        required:[true,"email is required"]
    },
    mobile:{
        type:Number,
        required:[true,"Mobile number is required"]
    },
    password:{
        type:String,
        required:[true,"password is required"]
    }
});

const userCollection = mongoose.model('user',userSchema);

module.exports = userCollection;