const nodemailer = require('nodemailer');
const getRSVPConfirmationTemplate = require('../templates/emailTemplates/rsvpConfirmation');

class EmailService {
  constructor() {
    // Log email configuration
    console.log('Initializing email service with:', {
      emailUser: process.env.EMAIL_USER ? 'Configured' : 'Missing',
      emailPassword: process.env.EMAIL_APP_PASSWORD ? 'Configured' : 'Missing'
    });

    // Create transporter with verbose logging
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
      },
      debug: true, // Enable debug logging
      logger: true  // Log to console
    });

    // Verify transporter configuration
    this.verifyConnection();
  }

  async verifyConnection() {
    try {
      const verification = await this.transporter.verify();
      console.log('Email service connection verified:', verification);
    } catch (error) {
      console.error('Email service connection failed:', error);
      throw new Error('Failed to initialize email service');
    }
  }

  async sendRSVPConfirmation(eventDetails, userDetails) {
    console.log('Preparing to send RSVP confirmation email:', {
      to: userDetails.email,
      event: eventDetails.title
    });

    try {
      // Generate email HTML
      const emailHtml = getRSVPConfirmationTemplate(eventDetails, userDetails);
      
      const mailOptions = {
        from: {
          name: 'Hokie Event Sphere',
          address: process.env.EMAIL_USER
        },
        to: userDetails.email,
        subject: `RSVP Confirmation - ${eventDetails.title}`,
        html: emailHtml,
        headers: {
          'X-Priority': '1',
          'X-MSMail-Priority': 'High',
          'Importance': 'high'
        }
      };

      console.log('Sending email with options:', {
        to: mailOptions.to,
        subject: mailOptions.subject,
        from: mailOptions.from
      });

      const info = await this.transporter.sendMail(mailOptions);
      
      console.log('Email sent successfully:', {
        messageId: info.messageId,
        response: info.response,
        accepted: info.accepted,
        rejected: info.rejected
      });
      
      return {
        success: true,
        messageId: info.messageId
      };
    } catch (error) {
      console.error('Error sending email:', {
        error: error.message,
        code: error.code,
        command: error.command,
        stack: error.stack
      });
      
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
}

module.exports = new EmailService();