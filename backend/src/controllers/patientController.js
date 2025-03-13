const { Patient } = require('../models');
const emailQueue = require('../queues/emailQueue');
const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

// GET all patients 
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.findAll();

    // Add photo URLs to each patient
    //TO-DO: Check what's happening with the uploads path
    const patientsWithUrls = patients.map(patient => {
      const patientObj = patient.toJSON();
      if (patientObj.documentPhoto) {
        patientObj.documentPhotoUrl = `/uploads/${patientObj.documentPhoto}`;
      }
      return patientObj;
    });

    res.json({ patients: patientsWithUrls });
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

    const patientObj = patient.toJSON();
    if (patientObj.documentPhoto) {
      patientObj.documentPhotoUrl = `/uploads/${patientObj.documentPhoto}`;
    }

    res.json({ patient: patientObj });
  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

//POST patient
exports.createPatient = async (req, res) => {
  // error handling
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (req.file) {
      fs.unlink(path.resolve(process.cwd(), 'uploads', req.file.filename), (err) => {
        if (err) console.error('Error deleting file after error:', err);
      });
    }
    return res.status(422).json({ errors: errors.mapped() });
  }

  try {
    const { fullName, email, countryCode, phoneNumber } = req.body;

    //email unicity check
    const existingPatient = await Patient.findOne({ where: { email } });
    if (existingPatient) {
      return res.status(400).json( { message: 'Email address is already registered'});
    }

    let documentPhoto = null;
    if (req.file) {
      documentPhoto = req.file.filename;
    }

    const patient = await Patient.create({
      fullName,
      email,
      countryCode,
      phoneNumber,
      documentPhoto
    });

    const patientObj = patient.toJSON();
    if (patientObj.documentPhoto) {
      patientObj.documentPhotoUrl = `/uploads/${patientObj.documentPhoto}`;
    }

    //Prepare email to be sent
    emailQueue.add('patientRegistration', {
      email: patient.email,
      fullName: patient.fullName
    });

    res.status(201).json({
      message: 'Patient registered successfully',
      patient: patientObj
    });
  } catch (error) {
    console.error('Error creating patient:', error);

    //error handling - delete uploaded file
    if (req.file) {
      fs.unlink(path.resolve(process.cwd(), 'uploads', req.file.filename), (err) => {
        if (err) console.error('Error deleting file after error:', err);
      });
    }

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json( { message: 'Email address is already registered'});
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

exports.getPatientPhoto = async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id);

    if (!patient || !patient.documentPhoto) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    const photoPath = path.resolve(process.cwd(), 'uploads', patient.documentPhoto);

    if (!fs.existsSync(photoPath)) {
      return res.status(404).json({ error: 'Photo file not found' });
    }

    res.sendFile(photoPath);
  } catch (error) {
    console.error('Error fetching patient photo:', error);
    res.status(500).json({ error: 'Server error' });
  }
};