if (process.env.NODE_ENV !== "production"){
    require("dotenv").config();
}

const express = require("express");
const app = express()
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");
const userRouter = require("./routers/users");
const animalRouter = require("./routers/animals");
const User = require("./models/user")

mongoose.connect('mongodb://127.0.0.1:27017/AnimalDictionary',{
    // username의 unique를 위한 설정
    autoIndex: true, //make this also true
    })
    .then(()=>{
        console.log("mongoDB CONNECT");
    })
    .catch((err)=>{
        console.log("OH mongoDB ERR")
        console.log(err)
    });

app.set("views",path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));


const sessionCongif = {
    secret:"secret",
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly: true,
        expires : Date.now() + 1000 * 60 * 60 * 24 *7, // 만료되는 시점 설정
        maxAge  : 1000 * 60 * 60 * 24 *7 // 얼마동안 유지되는지 설정
    }
}
app.use(session(sessionCongif));

app.use(async(req, res, next)=>{
    const currentUser = await User.findById(req.session.user_id);
    res.locals.currentUser = currentUser;
    req.user = currentUser;
    next()
})

app.get("/homepage", (req,res)=>{
    res.render("homepage")
})

app.use("/", userRouter);
app.use("/animal", animalRouter);

app.use((err, req, res, next)=>{
    const { status=500 } = err;
    if(!err.message){
        err.message = "Something is Wrong";
    }
    res.status(status).render("error", {err});
})

app.listen(3000, ()=>{
    console.log("SERVER START")
})

