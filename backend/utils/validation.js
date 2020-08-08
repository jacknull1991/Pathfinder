// Validation
const Joi = require('@hapi/joi');
const { SchemaType } = require('mongoose');

const userProfileValidation = data => {
    const schema = Joi.object({
        username: Joi.string().min(6).max(255).required(),
        password: Joi.string().min(8).required(),
        email: Joi.string().required().max(255).email(),
        nickname: Joi.string().allow('').min(6).max(255)
    });

    return schema.validate(data);
};

const loginValidation = data => {
    const schema = Joi.object({
        password: Joi.string().required(),
        email: Joi.string().required().email()
    });

    return schema.validate(data);
}


module.exports.userProfileValidation = userProfileValidation;
module.exports.loginValidation = loginValidation;
    