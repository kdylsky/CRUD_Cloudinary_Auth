const {UserSchema, AnimalSchema} = require("./schemas");
const ExpressError = require("./utils/ExpressError");
const Animal = require("./models/animal");

module.exports.validateUser = (req, res, next) => {
    const { error } = UserSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.validateAnimal = (req,res,next)=>{
    const { error } = AnimalSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

// 로그인 확인 미들웨어
module.exports.isLogin = (req,res, next)=>{
    if(!req.session.user_id){
        return res.redirect("/login")
    }
    next();
}

// 권한 확인 미들웨어
module.exports.isValidUser = async(req,res,next)=>{
    const {id} = req.params;
    const animal = await Animal.findById(id);
    if (!animal.user.equals(req.user._id)){
        return res.redirect(`/animal/${id}`)
    }
    next()    
}