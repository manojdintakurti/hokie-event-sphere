module.exports = {
    emailDefaults: {
      from: process.env.EMAIL_USER,
      replyTo: process.env.EMAIL_USER,
      footer: {
        companyName: 'Hokie Event Sphere',
        address: 'Your Address Here',
        unsubscribe: `${process.env.FRONTEND_URL}/unsubscribe`
      }
    },
    styleConfig: {
      primaryColor: '#622D87',
      secondaryColor: '#f9f9f9',
      fontFamily: 'Arial, sans-serif',
      fontSize: '16px'
    }
  };