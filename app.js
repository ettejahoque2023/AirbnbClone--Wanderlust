const express = require ("express");
const app= express();
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require("method-override");
const ejsMate =require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
const session = require('express-session');
const flash = require('connect-flash');
const passport=require("passport");
const localStrategy= require("passport-local");
const User= require("./models/user.js");


const listingsRouter= require("./routes/listing.js");
const reviewsRouter= require("./routes/review.js");
const userRouter= require("./routes/user.js");

main()
.then(()=>{
    console.log("Connected to DB");
})
.catch(err => console.log(err));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

async function main() {
  await mongoose.connect(MONGO_URL);
}

const sessionOptions ={
  secret : "mySuperSecretCode",
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge:7 * 24 * 60 * 60 * 1000,
    httpOnly:true,
  },
};

app.get("/",(req,res)=>{
  res.send("Hi, I am root");
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) =>{
  res.locals.success = req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);

app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page not found"));
});

app.use((err,req,res,next)=>{
  let{statusCode = 500,message="Something went wrong!"}=err;
  res.status(statusCode).render("error.ejs",{message});
  //res.status(statusCode).send(message);
});

//console.log(res.locals.redirectUrl);

app.listen(8080,()=>{
    console.log("server is listening to port 8080");
});