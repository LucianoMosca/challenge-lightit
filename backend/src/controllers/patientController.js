const { Patient } = require('../models');
const emailQueue = require('../queues/emailQueue');
const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

//GET all patients
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.findAll();
    res.json({ patients });
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

//GET a patient by ID
exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id);
    
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    res.json({ patient });
  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

//POST a new patient
exports.createPatient = async (req, res) => {
  //express validation errors?
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() });
  }

  try {
    const { fullName, email, countryCode, phoneNumber } = req.body;
    
    //uploaded file
    let documentPhoto = null;
    if (req.file) {
      documentPhoto = req.file.filename;
    }
    
    //new patient data
    const patient = await Patient.create({
      fullName,
      email,
      countryCode,
      phoneNumber,
      documentPhoto
    });
    
    //email
    emailQueue.add('patientRegistration', {
      patientId: patient.id,
      email: patient.email,
      fullName: patient.fullName
    });
    
    res.status(201).json({ 
      message: 'Patient registered successfully', 
      patient 
    });
  } catch (error) {
    console.error('Error creating patient:', error);
    
    //error handling
    if (req.file) {
      fs.unlinkSync(path.join(__dirname, '../../uploads', req.file.filename));
    }
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ 
        errors: { email: { msg: 'Email address is already registered' } }
      });
    }
    
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.reduce((acc, err) => {
        acc[err.path] = { msg: err.message };
        return acc;
      }, {});
      
      return res.status(400).json({ errors: validationErrors });
    }
    
    res.status(500).json({ error: 'Server error' });
  }
};