const Joi = require('joi')

module.exports = {
  register(req, res, next) {
    const schema = Joi.object({

      username: Joi.string().alphanum().min(3).max(15).required().error(errors => {
        errors.forEach(err => {
          switch (err.code) {
            case 'string.alphanum':
              err.message = 'Username should only contain alphanumeric characters!'
              break
            default:
              err.message = 'Username should have 3-15 characters!'
              break
          }
        })
        return errors
      }),

      email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required()
        .error(errors => {
          errors.forEach(err => {
            err.message = 'Please provide a valid email address!'
          })
          return errors
        }),
      
      password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{8,32}$'))
        .required()
        .error(errors => {
          errors.forEach(err => {
            err.message = 'Password should have 8-32 alphanumeric characters!'
          })
          return errors
        })
      
    })

    const { error } = schema.validate(req.body)
    if (error) {
      res.status(400).json({
        success: false,
        error: error.details[0].message
      })
    }
    else {
      next()
    }
  }
}