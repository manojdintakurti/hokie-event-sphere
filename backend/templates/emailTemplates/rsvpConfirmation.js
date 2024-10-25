const emailStyles = require('./styles');
const { formatDate, formatTime } = require('../../utils/dateUtils');

const getRSVPConfirmationTemplate = (eventDetails, userDetails) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          ${emailStyles}
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>RSVP Confirmation</h1>
          </div>
          
          <div class="content">
            <h2>Thank you for your RSVP, ${userDetails.name}!</h2>
            <p>Your registration for the following event has been confirmed:</p>
            
            <div class="event-details">
              <h3>${eventDetails.title}</h3>
              <div class="event-detail-item">
                <strong>📅 Date:</strong> ${formatDate(eventDetails.startDate)}
              </div>
              <div class="event-detail-item">
                <strong>⏰ Time:</strong> ${formatTime(eventDetails.startTime)} - ${formatTime(eventDetails.endTime)}
              </div>
              <div class="event-detail-item">
                <strong>📍 Location:</strong> ${eventDetails.venue}
              </div>
              ${eventDetails.registrationFee ? `
              <div class="event-detail-item">
                <strong>💰 Registration Fee:</strong> $${eventDetails.registrationFee}
              </div>
              ` : ''}
            </div>

            <p>Event Description:</p>
            <p>${eventDetails.description}</p>

            <div class="divider"></div>

            <h3>Your RSVP Details:</h3>
            <p><strong>Name:</strong> ${userDetails.name}</p>
            <p><strong>Email:</strong> ${userDetails.email}</p>
            ${userDetails.phone ? `<p><strong>Phone:</strong> ${userDetails.phone}</p>` : ''}

            <p>If you need to make any changes to your RSVP or have questions, please contact the event organizer at ${eventDetails.organizerEmail}</p>

            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL}/events/${eventDetails._id}" class="button">
                View Event Details
              </a>
            </div>
          </div>

          <div class="footer">
            <p>This is an automated message, please do not reply to this email.</p>
            <p>© ${new Date().getFullYear()} Hokie Event Sphere. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

module.exports = getRSVPConfirmationTemplate;