// services/emailService.js
const nodemailer = require('nodemailer');
const getRSVPConfirmationTemplate = require('../templates/emailTemplates/rsvpConfirmation');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
      }
    });
  }

  async sendRSVPConfirmation(eventDetails, userDetails) {
    const emailHtml = getRSVPConfirmationTemplate(eventDetails, userDetails);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userDetails.email,
      subject: `RSVP Confirmation - ${eventDetails.title}`,
      html: emailHtml
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.response);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}

module.exports = new EmailService();