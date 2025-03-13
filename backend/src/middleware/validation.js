const { body } = require('express-validator');

exports.validatePatient = [
  body('fullName')
  // full name with a proper format
    .notEmpty().withMessage('Full name is required')
    .matches(/^[a-zA-Z\s]+$/).withMessage('Full name should only contain letters'),
  
  body('email')
  //email and format
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .custom(value => {
      if (!value.endsWith('@gmail.com')) {
        throw new Error('By now, we only allow GMail accounts! Sorry!');
      }
      return true;
    }),
  //phone number
  body('countryCode')
    .notEmpty().withMessage('Country code is required'),
  
  body('phoneNumber')
    .notEmpty().withMessage('Phone number is required')
];