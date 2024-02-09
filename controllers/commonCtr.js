const userCollection = require("../models/userModel");
const bycrpt = require('bcrypt');
const nodemailer = require('nodemailer');

const common = (page)=>{
    return (req,res)=>{
        try{
            if(req.session.user && req.session.logged){
                req.session.logged=false;
                res.render(page,{fname:req.session.user.fname,dsply_1:"d-none",dsply_2:"d-none",dsply_3:"d-block",dsply_4:"d-block",alert:true})
            }else if(req.session.user){
                res.render(page,{fname:req.session.user.fname,dsply_1:"d-none",dsply_2:"d-none",dsply_3:"d-block",dsply_4:"d-block"});
            }else{
                res.render(page);
            }
        }catch(err){
            console.log(err);
            res.status(500).render('500');
        }
    }
}

const home = common("index");
const about = common("about");
const contact = common("contact");
const faqs = common('faqs');

const login = (req,res)=>{
    try{
        if(req.session.accountCreated){
            req.session.accountCreated =false;
            req.session.check_signUp=false;
            res.render('login',{alert:true,dsply_1:"d-none"});
        }else if(req.session.password_updated ){
            req.session.password_updated=false;
            res.render('login',{alert:true,alertMessage:"password reset successfully!!!",dsply_1:"d-none"});
        }else{
            req.session.check_email = true;
            res.render('login',{dsply_1:"d-none"});
        }
    }catch(err){
        console.log(err);
        res.status(500).render('500');
    }
    
}
const signUp = (req,res)=>{
    try{
    if(!req.session.check_signUp) {
        res.render('signUp',{dsply_2:"d-none"});  
    }
    }catch(err){
        console.log(err);
        res.status(500).render('500');
    }
}

const email = (doc,signup_otp)=>{
    var transporter = nodemailer.createTransport({
     service: "gmail",
     auth: {
       user: "akhilmkrishnan2001@gmail.com",
       pass: "ypyp jelq ronq dbzj",
     },
   });

   var mailOptions = {
     from: "akhilmkrishnan2001@gmail.com",
     to: `${doc.email}`,
     subject: "Registeration otp",
     text: `
     Hello ${doc.fname},
                  your Otp for signUp is ${signup_otp}
     `,
   };

   transporter.sendMail(mailOptions, function (error, info) {
     if (error) {
       console.log(error);
     } else {
       console.log("Email sent: " + info.response);
     }
   });
 }

const singUp_post = async(req,res)=>{
   try{
    if(!req.session.check_signUp){
        let existing_email = await userCollection.findOne({email:req.body.email});
        let existing_password = await userCollection.findOne({mobile:req.body.mobile});
    if(existing_email){
       res.render('signUp',{alert:"email already exists",fname:req.body.fname,lname:req.body.lname,mobile:req.body.mobile,password:req.body.password,re_password:req.body.rePassword,check:true});
    }else if(existing_password){
        res.render('signUp',{alert:"mobile number already exists",fname:req.body.fname,lname:req.body.lname,email:req.body.email,password:req.body.password,re_password:req.body.rePassword,check:true});
    }else{
        const hashPassword = await bycrpt.hash(req.body.password,10);
        req.body.password = hashPassword;
        // delete req.body.rePassword (to delete repassword property)
        if(!req.session.email){
            req.session.doc =[];
            req.session.email = [];
            req.session.otpCountown=[];
            req.session.signUpOtp =[];
        }      
        let timeDifference = Date.now()-req.session.otpCountown[req.params.index];
        let timer = 30-Math.floor(timeDifference / 1000);
        console.log(timer);
        if(timer <= 0 && isNaN(timer) || req.session.signUpOtp.length === 0 || !req.session.email.includes(req.body.email)){
            req.session.signUpOtp.push(Math.floor(10000 + Math.random() * 90000));
            req.session.doc.push(req.body); 
            req.session.email.push(req.body.email)
            req.session.index = req.session.doc.length-1;
            email(req.session.doc[req.session.index],req.session.signUpOtp[req.session.index]);
            req.session.otpCountown.push(Date.now());
        }
        res.redirect(`/signup-otp/${req.session.index}`);
    }

    }
   }catch(err){
        console.log(err);
        res.status(500).render('500');
   }
}

const login_post = async(req,res)=>{
    try{
        req.session.user = await userCollection.findOne({email:req.body.emailOrMob});
        if(!req.session.user){
            req.session.user = await userCollection.findOne({mobile:Number(req.body.emailOrMob)});
        }
        if(req.session.user){
            const passwordMatch = await bycrpt.compare(req.body.password,req.session.user.password);
            if(passwordMatch){
                req.session.logged=true;
                res.redirect('/');
            }
        }else{
            res.render('login');
        }
    }catch(err){
        console.log(err);
        res.status(500).render('500');
    }
}

const profile = (req,res)=>{
    try{
        if(req.session.user){
            res.render('dashboard',{fname:req.session.user.fname,dsply_1:"d-none",dsply_2:"d-none",dsply_3:"d-block",dsply_4:"d-block"})
        }else{
            res.redirect('/login');
        }
    }catch(err){
        console.log(err);
        res.status(500).render('500');
    }
}

const cart = (req,res)=>{
    try{
        if(req.session.user){
            res.render('cart',{fname:req.session.user.fname,dsply_1:"d-none",dsply_2:"d-none",dsply_3:"d-block",dsply_4:"d-block"})
        }else{
            res.render('cart',{fname:req.session.user.fname,dsply_1:"d-block",dsply_2:"d-block",dsply_3:"d-none",dsply_4:"d-none"});
        }
    }catch(err){
        console.log(err);
        res.status(500).render('500');
    }
}

const logout = (req,res)=>{
    try{
        if(req.session.user){
            delete req.session.user;
            res.redirect('/');
        }else{
            res.redirect('/login');
        }
    }catch(err){
        console.log(err);
        res.status(500).render('500');
    }
}

const signup_otp = (req,res)=>{
try{
    if(req.session.signUpOtp[req.params.index] && req.session.invalidOtp){
        req.session.invalidOtp=false;
        res.render('otp',{timer:req.session.otpCountown[req.params.index],otpInvalid:true,index:req.params.index});
    }else if(req.session.signUpOtp[req.params.index]){
        res.render('otp',{timer:req.session.otpCountown[req.params.index],index:req.params.index});
    }else{
        res.redirect('/signUp');
    }
}catch(err){
    console.log(err);
    res.status(500).render('500');
}
}

const signup_otp_post =async (req,res)=>{
    try{
        if(req.session.signUpOtp[req.params.index]){
            if(Number(req.body.otp) === req.session.signUpOtp[req.params.index]){
                let doc = new userCollection(req.session.doc[req.params.index])
                await doc.save();
                req.session.check_signUp = true;
                req.session.accountCreated = true;
                delete req.session.signUpOtp[req.params.index];
                res.redirect('/login');
            }else{
                req.session.invalidOtp = true;
                res.redirect(`/signup-otp/${req.params.index}`);
            }
        }
    }catch(err){
        console.log(err);
        res.status(500).render('500');
    }
}
const resend_signup_otp =(req,res)=>{
    try{
        if(req.session.signUpOtp[req.params.index]){
            req.session.signUpOtp[req.params.index] = Math.floor(10000 + Math.random() * 90000);
            email(req.session.doc[req.params.index],req.session.signUpOtp[req.params.index]);
            req.session.otpCountown[req.params.index] = Date.now();
            res.redirect(`/signup-otp/${req.params.index}`);
        }
    }catch(err){
        console.log(err);
        res.status(500).render('500');
    }
    
}

const  forgetPassword = (req,res)=>{
   try{
    if(!req.session.check_email){
        res.render('forgetPassword',{error:"*email is invalid"});
    }else if(!req.session.user){
        res.render('forgetPassword');
    }
   }catch(err){
    console.log(err);
    res.status(500).render('500');
   }
}

const forgetPassword_post = async(req,res)=>{
   try{
    req.session.userdoc = await userCollection.findOne({email:req.body.email});
   if(req.session.userdoc){
    let timeDifference = Date.now()-req.session.login_otpCountown ;
    let timer = 30-Math.floor(timeDifference / 1000);
    if(timer <= 0 || !req.session.check_login_otp){
    req.session.loginOtp = Math.floor(10000 + Math.random() * 90000);
    email(req.session.userdoc,req.session.loginOtp);
    req.session.check_login_otp =true;
    req.session.check_email=true;
    req.session.login_otpCountown = Date.now();
    }
    res.redirect('/otpAccept');
   }else{
    req.session.check_email = false;
    res.redirect('/forgetPassword');
   }
   }catch(err){
    console.log(err);
    res.status(500).render('500');
   }
} 

const passwordChange_otp = (req,res)=>{
   try{
    if(req.session.check_login_otp){
        req.session.loginOtp = Math.floor(10000 + Math.random() * 90000);
        email(req.session.userdoc,req.session.loginOtp);
        req.session.login_otpCountown = Date.now();
        req.session.login_otpInvalid=false;
        res.redirect('/otpAccept');
    }
   }catch(err){
        console.log(err);
        res.status(500).render('500');
   }
}

const otpAccept =(req,res)=>{
    try{
        if(req.session.login_otpInvalid){
            req.session.check_email=true;
            req.session.login_otpInvalid = false;
            res.render('otpAccept',{timer:req.session.login_otpCountown,otpInvalid:true})
        }else if(req.session.check_login_otp){
            req.session.check_email=true;
            res.render('otpAccept',{timer:req.session.login_otpCountown});
        }
    }catch(err){
        console.log(err);
        res.status(500).render('500');
    }
}

const otpAccept_post = (req,res)=>{
   try{
    if(req.session.check_login_otp){
        if(Number(req.body.otp) === req.session.loginOtp){
            res.redirect('/resetPassword');
        }else{
            req.session.login_otpInvalid =true;
            res.redirect('/otpAccept');
        }
    }
   }catch(err){
    console.log(err);
    res.status(500).render('500');
}
}

const resetPassword = (req,res)=>{
    try{
        if(req.session.check_login_otp){
            res.render('resetPassword');
        }
    }catch(err){
        console.log(err);
        res.status(500).render('500');
    }
}

const resetPassword_post = async (req,res)=>{
    try{
        const hashPassword = await bycrpt.hash(req.body.password,10);
        req.body.password = hashPassword;
        const user = await userCollection.updateOne({_id:req.session.userdoc._id},{
            $set:{
                password:req.body.password
            }
        });
        if(user){
            delete req.session.userdoc;
            req.session.check_login_otp =false;
            req.session.password_updated =true;
            res.redirect('/login');
        }
    }catch(err){
    console.log(err);
    res.status(500).render('500');
}
}


module.exports = {
    home,
    about,
    contact,
    faqs,
    login,
    signUp,
    singUp_post,
    login_post,
    profile,
    cart,
    logout,
    signup_otp,
    signup_otp_post,
    resend_signup_otp,
    forgetPassword,
    otpAccept,
    forgetPassword_post,
    otpAccept_post,
    resetPassword ,
    resetPassword_post,
    passwordChange_otp
}