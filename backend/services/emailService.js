// services/emailService.js
const nodemailer = require('nodemailer');
const getRSVPConfirmationTemplate = require('../templates/emailTemplates/rsvpConfirmation');

class EmailService {
  constructor() {
    this.isInitialized = false;

    // Log email configuration
    console.log('Initializing email service with:', {
      emailUser: process.env.EMAIL_USER ? 'Configured' : 'Missing',
      emailPassword: process.env.EMAIL_APP_PASSWORD ? 'Configured' : 'Missing'
    });

    if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
      console.warn('Email service credentials not configured. Email sending will be disabled.');
      return;
    }

    // Create transporter
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
      },
      debug: true,
      logger: true
    });

    // Verify connection
    this.verifyConnection();
  }

  async verifyConnection() {
    try {
      const verification = await this.transporter.verify();
      console.log('Email service connection verified:', verification);
      this.isInitialized = true;
    } catch (error) {
      console.error('Email service connection failed:', error);
      this.isInitialized = false;
    }
  }

  async sendRSVPConfirmation(eventDetails, userDetails) {
    // Check if email service is properly initialized
    if (!this.isInitialized) {
      console.warn('Email service not initialized. Skipping email send.');
      return {
        success: false,
        error: 'Email service not initialized'
      };
    }

    try {
      console.log('Preparing to send RSVP confirmation email to:', userDetails.email);

      const emailHtml = getRSVPConfirmationTemplate(eventDetails, userDetails);
      
      const mailOptions = {
        from: {
          name: 'Hokie Event Sphere',
          address: process.env.EMAIL_USER
        },
        to: userDetails.email,
        subject: `RSVP Confirmation - ${eventDetails.title}`,
        html: emailHtml
      };

      const info = await this.transporter.sendMail(mailOptions);
      
      console.log('Email sent successfully:', {
        messageId: info.messageId,
        response: info.response
      });
      
      return {
        success: true,
        messageId: info.messageId
      };
    } catch (error) {
      console.error('Error sending email:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new EmailService();