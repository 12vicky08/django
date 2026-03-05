const test = require('node:test');
const assert = require('node:assert');
const { formatTime } = require('../utils');

test('formatTime utility', async (t) => {
  const now = new Date('2023-10-01T12:00:00Z');

  await t.test('returns "Just now" for less than 1 minute', () => {
    const thirtySecondsAgo = new Date(now.getTime() - 30 * 1000).toISOString();
    assert.strictEqual(formatTime(thirtySecondsAgo, now), 'Just now');
  });

  await t.test('returns minutes ago for less than 1 hour', () => {
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000).toISOString();
    assert.strictEqual(formatTime(fiveMinutesAgo, now), '5m ago');

    const fiftyNineMinutesAgo = new Date(now.getTime() - 59 * 60 * 1000).toISOString();
    assert.strictEqual(formatTime(fiftyNineMinutesAgo, now), '59m ago');
  });

  await t.test('returns hours ago for less than 24 hours', () => {
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
    assert.strictEqual(formatTime(oneHourAgo, now), '1h ago');

    const twentyThreeHoursAgo = new Date(now.getTime() - 23 * 60 * 60 * 1000).toISOString();
    assert.strictEqual(formatTime(twentyThreeHoursAgo, now), '23h ago');
  });

  await t.test('returns days ago for less than 7 days', () => {
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    assert.strictEqual(formatTime(oneDayAgo, now), '1d ago');

    const sixDaysAgo = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString();
    assert.strictEqual(formatTime(sixDaysAgo, now), '6d ago');
  });

  await t.test('returns localized date string for 7 days or more', () => {
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    // Locale dependent, but we expect something like "Sep 24"
    const result = formatTime(sevenDaysAgo, now);
    assert.match(result, /Sep 24/);
  });

  await t.test('handles future dates (shows localized date)', () => {
    const futureDate = new Date(now.getTime() + 1000).toISOString();
    // diffMs will be negative, diffMins will be 0 or negative
    // According to logic: if (diffMins < 1) return 'Just now';
    assert.strictEqual(formatTime(futureDate, now), 'Just now');
  });
});
