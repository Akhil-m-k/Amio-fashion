const express = require("express");
const app = express();
const session = require("express-session");
const {v4:uuid4}=require("uuid");
const nocache = require("nocache");
const connectDB = require("./db");
const adminRoutes = require("./routes/adminRoutes");

app.get('/',(req,res)=>{
    res.send("hello akhil")
})

app.use('/admin',adminRoutes)
connectDB();

const port = process.env.PORT || 3000
//// server listening
app.listen(port,()=>{
console.log(`server listening on ${port}...`)
});