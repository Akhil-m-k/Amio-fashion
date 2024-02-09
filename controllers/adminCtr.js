//// importing models (collections)
const adminCollection = require("../models/adminModel");
const userCollection = require("../models/userModel");
const productCollection = require("../models/productModel");

///// admin password setting
const passwordSet = async (_, res) => {
    const check = await adminCollection.find({});
    if (check.length === 0) {
      const admin = new adminCollection({
        name:"Akhil",
        username: "admin@321",
        password: "admin@123",
      });
      await admin.save();
      res.send("password created succesfully");
    }else{
        res.send("You don't have access to this page...!!!");
    }
  };

  module.exports ={
    passwordSet
  }