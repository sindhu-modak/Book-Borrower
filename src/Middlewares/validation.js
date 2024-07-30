import Joi from '@hapi/joi';

const borrowBookSchema = Joi.object({
    user_id: Joi.number().integer().required(),
    book_id: Joi.number().integer().required()
});

const returnBookSchema = Joi.object({
    user_id: Joi.number().integer().required(),
    book_id: Joi.number().integer().required()
});

const borrowInfoSchema = Joi.object({
    user_id: Joi.number().integer().required()
});

export const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        next();
    };
};

export { borrowBookSchema, returnBookSchema, borrowInfoSchema };
