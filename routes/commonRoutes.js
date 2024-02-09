const express = require('express');
const router = express.Router();
const commonController = require('../controllers/commonCtr.js');

router.get('/',commonController.home);
router.get('/about',commonController.about);
router.get('/contact',commonController.contact);
router.get('/faqs',commonController.faqs);
router.get("/login",commonController.login);
router.post("/login",commonController.login_post);
router.get("/signUp",commonController.signUp);
router.post("/signUp",commonController.singUp_post);
router.get('/profile',commonController.profile);
router.get('/logout',commonController.logout);
router.get('/signup-otp/:index',commonController.signup_otp);
router.post('/signup-otp/:index',commonController.signup_otp_post);
router.get('/resend-signup-otp/:index',commonController.resend_signup_otp);
router.get('/forgetPassword',commonController.forgetPassword);
router.post('/fogetPassword',commonController.forgetPassword_post);
router.get('/otpAccept',commonController.otpAccept);
router.post('/otpAccept',commonController.otpAccept_post);
router.get('/resetPassword',commonController.resetPassword);
router.post('/resetPassword',commonController.resetPassword_post);
router.get('/passwordChange-otp',commonController.passwordChange_otp)

module.exports = router;