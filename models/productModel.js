const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    pname:{
        type:String,
        required:[true,"product name is required"]
    },
    category:{
        type:String,
        required:[true,"category is required"]
    },
    images:{
        type:Object,
        required:[true,"images is required"]
    },
    description:{
        type:String,
        required:[true,"description is required"]
    },
    price:{
        type:Number,
        required:[true,"price is required"]
    },
    quantity:{
        type:Number,
        required:[true,"quantity is required"]
    },
    discount:{
        type:Number,
        required:[true,"discount is required"]
    },
    tax:{
        type:Number,
        required:[true,"tax is required"]
    }
});

const  productCollection= mongoose.model("product",productSchema);

module.exports = productCollection;