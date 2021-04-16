const Joi = require('joi');

exports.validate = function (data) {
    const userSchemaValidation = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        phone: Joi.string().required(),
        address: Joi.object({
            address: Joi.string(),
            postal_code: Joi.string(),
            city: Joi.string(),
            country: Joi.string(),
        }),
        email: Joi.string().email().required(),
        password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@\?\.#\$%\^&\*])(?=.{8,})/),
        isAdmin: Joi.boolean()
    });
    return userSchemaValidation.validate(data);
}

exports.validateBeforeUpdate = function (data) {
    const userSchemaValidation = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        phone: Joi.string().required(),
        address: Joi.object({
            address: Joi.string(),
            postal_code: Joi.string(),
            city: Joi.string(),
            country: Joi.string(),
        })
    });
    return userSchemaValidation.validate(data);
}