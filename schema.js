const joi = require("joi");
module.exports.listingSchema = joi.object({
  listing: joi
    .object({
      title: joi.string().required(),
      description: joi.string().required(),
      price: joi.number().required().min(0),
      location: joi.string().required(),
      country: joi.string().required(),
      image: joi.string().allow("", null),
    })
    .required(),
});

// review schema for sever side validation

module.exports.ReviewSchema = joi.object({
  review: joi
    .object({
      rating: joi.string().required().min(1).max(5),
      comment: joi.string().required(),
    })
    .required(),
});
