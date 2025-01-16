const express= require("express");
const router= express.Router();
const User= require("../models/user.js");
const { render } = require("ejs");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

 const userController = require("../controllers/user.js");

//Render signup form
router.get("/signup" , userController.renderSignupForm);

//Sign up form
router.post("/signup",wrapAsync(userController.signup));

//Render log in form
router.get("/login",userController.renderLoginForm);

//Log in form
router.post("/login",saveRedirectUrl,
    passport.authenticate("local",{ failureRedirect: '/login' , failureFlash: true,}),wrapAsync(userController.login));

//Log out
router.get("/logout",userController.logOut);

module.exports= router;
