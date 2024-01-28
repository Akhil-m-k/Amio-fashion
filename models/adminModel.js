const mongoose = require('mongoose');

const adminCollection = mongoose.model("admin",{name:String,username:String,password:String});
module.exports = adminCollection;