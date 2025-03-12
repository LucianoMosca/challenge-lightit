const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { validatePatient } = require('../middleware/validation');
const upload = require('../middleware/upload');

//endpoints
router.get('/', patientController.getAllPatients);
router.get('/:id', patientController.getPatientById);
router.post(
  '/',
  upload.single('documentPhoto'),
  validatePatient,
  patientController.createPatient
);

module.exports = router;