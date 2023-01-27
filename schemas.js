const Joi = require("joi")

module.exports.UserSchema = Joi.object({
    nickname:Joi.string().required(),
    password:Joi.string().required(),
})

module.exports.AnimalSchema = Joi.object({
    name:Joi.string().required(),
    description:Joi.string().required(),
    lifespan:Joi.number().required(),
    images:Joi.array().required()
}).options({abortEarly: false})