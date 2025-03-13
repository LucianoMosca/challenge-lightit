const Bull = require('bull');
const nodemailer = require('nodemailer');

//Redis and Bull
const emailQueue = new Bull('email', {
  redis: {
    host: process.env.REDIS_HOST || 'redis',
    port: process.env.REDIS_PORT || 6379
  }
});

//email transporter
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || 'mailhog',
  port: process.env.MAIL_PORT || 1025,
  secure: false,
  auth: null, 
  ignoreTLS: true,
  authMethod: 'NONE'
});

//email processor
emailQueue.process('patientRegistration', async (job) => {
  try {
    const { email, fullName } = job.data;

    const mailOptions = {
      from: process.env.MAIL_FROM || 'no-reply@hospital.com',
      to: email,
      subject: 'Registration Confirmation',
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <p>Hello ${fullName}, this is an email!</p>
      </div>
    `
    };

    return transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Failed to send email: ', error);
    throw error;
  }
});

emailQueue.on('failed', (job, error) => {

  console.error(`Job ${job.id} failed with error: ${error.message}`);
});

emailQueue.on('error', (error) => {
  console.error('Bull queue error:', error);
});

emailQueue.on('completed', (job, result) => {
  console.log(`Job ${job.id} completed successfully`);
});

module.exports = emailQueue;