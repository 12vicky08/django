/**
 * Formats an ISO date string into a human-readable relative time or a short date.
 * @param {string} isoString - The ISO date string to format.
 * @param {Date} [now=new Date()] - Optional reference date for testing.
 * @returns {string} The formatted time string.
 */
function formatTime(isoString, now = new Date()) {
  const date = new Date(isoString);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

// Export for Node.js tests
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { formatTime };
}
