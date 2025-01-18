const user = require("../models/user");

module.exports.renderSignupForm =  (req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signup = async(req,res)=>
{
    try{
    let{username,email,password}=req.body;
    const newUser = new user({email,username});
    const registeredUser = await user.register(newUser,password);
    req.login(registeredUser , (err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","welcome to Wanderlust");
        res.redirect("/listings");  
    })}catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
};


module.exports.renderLoginForm =(req,res) =>{
    res.render("users/login.ejs");
};

module.exports.login = async(req,res)=>{
    req.flash("success","Welcome back to Wanderlust !Youu are logged in");
    console.log(res.locals.redirectUrl);
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logOut = (req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are logged out!");
        res.redirect("/listings");
    });
};