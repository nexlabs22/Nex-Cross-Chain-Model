export function timeAgo(blockstamp: number) {
    const now = Date.now(); // Current timestamp in milliseconds
    const diffInMilliseconds = now - blockstamp; // Difference between current time and blockstamp
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000); // Convert milliseconds to seconds
  
    // Define time intervals in seconds
    const intervals = {
      minute: 60,
      hour: 3600,
      day: 86400,
      week: 604800,
      month: 2592000, // Approximate month (30 days)
      year: 31536000, // Approximate year (365 days)
    };
  
    // Determine and return the appropriate message based on the time difference
    if (diffInSeconds < 60) {
      return diffInSeconds < 10 ? 'A few seconds ago' : `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < intervals.hour) {
      const minutes = Math.floor(diffInSeconds / intervals.minute);
      return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
    } else if (diffInSeconds < intervals.day) {
      const hours = Math.floor(diffInSeconds / intervals.hour);
      return hours === 1 ? 'An hour ago' : `${hours} hours ago`;
    } else if (diffInSeconds < intervals.week) {
      const days = Math.floor(diffInSeconds / intervals.day);
      return days === 1 ? '1 day ago' : `${days} days ago`;
    } else if (diffInSeconds < intervals.month) {
      const weeks = Math.floor(diffInSeconds / intervals.week);
      return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
    } else if (diffInSeconds < intervals.year) {
      const months = Math.floor(diffInSeconds / intervals.month);
      return months === 1 ? '1 month ago' : `${months} months ago`;
    } else {
      const years = Math.floor(diffInSeconds / intervals.year);
      return years === 1 ? '1 year ago' : `${years} years ago`;
    }
  }
  