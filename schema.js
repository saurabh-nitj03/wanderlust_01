
const joi = require('joi');

module.exports.listingSchema = joi.object({
    title: joi.string().required(), 
    description: joi.string().required(),
    location: joi.string().required(),
    country: joi.string().required(),
    price: joi.number().required().min(0),
    image: joi.string().allow('', null)  // Optional image
});

// module.exports.reviewSchema=joi.object({
//     review:joi.object({
//        rating:joi.number().required(),
//        comment:joi.string().required()
//     }).required()
// })

// const joi = require('joi');

module.exports.reviewSchema = joi.object({
    reviews:joi.object({
    rating: joi.number().required().min(0).max(5).messages({
        'any.required': 'Rating is required',
        'number.min': 'Rating must be at least 1',
        'number.max': 'Rating cannot be more than 5'
    }),
    comment: joi.string().required().messages({
        'any.required': 'Comment is required',
        'string.empty': 'Comment cannot be empty'
    })
}).required()
});
