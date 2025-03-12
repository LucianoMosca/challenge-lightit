const Bull = require('bull');
const nodemailer = require('nodemailer');

// here we config Redis and Bull, this will be in charge of sending emails asynchronously to improve perfrmance
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
  auth: {
    user: process.env.MAIL_USER || null,
    pass: process.env.MAIL_PASS || null
  }
});

//email processor
emailQueue.process('patientRegistration', async (job) => {
  const { email, fullName } = job.data;
  
  const mailOptions = {
    from: process.env.MAIL_FROM || 'no-reply@hospital.com',
    to: email,
    subject: 'Registration Confirmation',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <p>Hello ${fullName}, this is an email</p>
      </div>
    `
  };
  
  return transporter.sendMail(mailOptions);
});

//we export the queue so we can use it in other parts of the app
module.exports = emailQueue;