// services/emailService.js
const nodemailer = require('nodemailer');

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

  generateEmailTemplate(eventDetails, userDetails) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #622D87;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 5px 5px 0 0;
            }
            .content {
              background-color: #ffffff;
              padding: 20px;
              border-radius: 0 0 5px 5px;
              border: 1px solid #e0e0e0;
            }
            .event-details {
              background-color: #f5f5f5;
              padding: 15px;
              margin: 20px 0;
              border-radius: 5px;
              border-left: 4px solid #622D87;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 12px;
              color: #666666;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>RSVP Confirmation</h1>
            </div>
            <div class="content">
              <h2>Thank you for your RSVP, ${userDetails.name}!</h2>
              <p>Your registration for the following event has been confirmed:</p>
              
              <div class="event-details">
                <h3>${eventDetails.title}</h3>
                <p><strong>📅 Date:</strong> ${new Date(eventDetails.startDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
                <p><strong>⏰ Time:</strong> ${eventDetails.startTime} - ${eventDetails.endTime}</p>
                <p><strong>📍 Location:</strong> ${eventDetails.venue}</p>
                ${eventDetails.registrationFee ? `
                <p><strong>💰 Registration Fee:</strong> $${eventDetails.registrationFee}</p>
                ` : ''}
              </div>

              <h3>Event Description:</h3>
              <p>${eventDetails.description}</p>

              <div class="event-details">
                <h3>Your RSVP Details:</h3>
                <p><strong>Name:</strong> ${userDetails.name}</p>
                <p><strong>Email:</strong> ${userDetails.email}</p>
                ${userDetails.phone ? `<p><strong>Phone:</strong> ${userDetails.phone}</p>` : ''}
              </div>

              <p>If you need to make any changes to your RSVP or have questions, please contact the event organizer at ${eventDetails.organizerEmail}</p>
            </div>
            
            <div class="footer">
              <p>This is an automated message from Hokie Event Sphere</p>
              <p>© ${new Date().getFullYear()} Hokie Event Sphere. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  async sendRSVPConfirmation(eventDetails, userDetails) {
    try {
      console.log('Preparing to send email to:', userDetails.email);

      const emailHtml = this.generateEmailTemplate(eventDetails, userDetails);
      
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
      throw error;
    }
  }
}

module.exports = new EmailService();