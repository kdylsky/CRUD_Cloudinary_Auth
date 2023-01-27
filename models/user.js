const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
    nickname:{
        type:String,
        unique:true,
        requried:true

    },
    password:{
        type:String,
        required:true
    }
})

UserSchema.statics.findOneAndVaildate = async function(nickname, password){
    const founduser = await this.findOne({nickname});
    if(founduser){
        const isValid = await bcrypt.compare(password, founduser.password);
        return isValid ? founduser : false; 
    }else{
        return false;
    }
};

UserSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next(); 
    this.password = await bcrypt.hash(this.password, 12)
    next();
})


const User = mongoose.model("User", UserSchema);

module.exports = User;