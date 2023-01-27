const User = require("../models/user");

module.exports.renderRegister = (req,res)=>{
    res.render("users/register")
}

module.exports.register = async(req,res)=>{
    const {nickname, password} = req.body;
    const user = new User({nickname, password});
    await user.save();
    req.session.user_id = user._id;    
    res.redirect("/homepage")
}

module.exports.renderLogin = (req,res)=>{
    res.render("users/login")
}

module.exports.login = async(req,res)=>{
    const {nickname, password} = req.body;
    const user = await User.findOneAndVaildate(nickname, password);
    if (user){
        req.session.user_id = user._id
        res.redirect("/homepage")
    }else{
        res.redirect("/login")
    }
}

module.exports.logout = async(req,res)=>{
    req.session.destroy()
    res.redirect("/login");
}