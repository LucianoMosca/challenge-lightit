'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Patient extends Model {
    static associate(models) {
      // TO-DO: check thissssss
    }
  }
  
  Patient.init({
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'full_name',
      validate: {
        is: /^[a-zA-Z\s]+$/
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        isGmail(value) {
          if (!value.endsWith('@gmail.com')) {
            throw new Error('By now, we only allow GMail accounts! Sorry!');
          }
        }
      }
    },
    countryCode: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'country_code'
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'phone_number'
    },
    documentPhoto: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'document_photo'
    }
  }, {
    sequelize,
    modelName: 'Patient',
    tableName: 'patients',
    underscored: true
  });
  
  return Patient;
};