const express = require("express");
const app = express();
const session = require("express-session");
const {v4:uuidv4}=require("uuid");
const nocache = require("nocache");
const connectDB = require("./db");
const commonRoutes = require('./routes/commonRoutes');
const adminRoutes = require("./routes/adminRoutes");
/// session
app.use(session({
    secret:uuidv4(),
    resave:false,
    saveUninitialized:true
}));
app.use(nocache());
//// set is used for configuration
app.set('view engine','ejs');

/////build-in middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//// router handling middleware
app.use('/',commonRoutes);
app.use('/admin',adminRoutes);

// global error handling middleware
app.use((err,req,res,next)=>{
    console.log(err);
    res.status(500).render('500');
});

// page not found error handling
app.use((req,res)=>{
    res.status(404).render('404');
});
//// mogodb connection making
connectDB();

const port = process.env.PORT || 3000
//// server listening
app.listen(port,()=>{
console.log(`server listening on ${port}...`)
});