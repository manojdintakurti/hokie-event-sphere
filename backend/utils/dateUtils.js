const formatDate = (date) => {
    const eventDate = new Date(date);
    return eventDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).replace(/(\d+)(?=\b)/, function(day) {
      // Add ordinal suffix to the day
      const j = day % 10;
      const k = day % 100;
      if (j === 1 && k !== 11) return day + "st";
      if (j === 2 && k !== 12) return day + "nd";
      if (j === 3 && k !== 13) return day + "rd";
      return day + "th";
    });
  };
  
  const formatTime = (time) => {
    return new Date(`2000-01-01 ${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };
  
  module.exports = {
    formatDate,
    formatTime
  };