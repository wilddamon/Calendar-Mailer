
/**
 * @fileoverview An RFC3339 timestamp formatter.
 *
 * RFC3339 timestamps are a stricter subset of the ISO8601, and fufil the
 * following format:
 *
 *    date-fullyear   = 4DIGIT
 *    date-month      = 2DIGIT  ; 01-12
 *    date-mday       = 2DIGIT  ; 01-28, 01-29, 01-30, 01-31 based on
 *                              ; month/year
 *    time-hour       = 2DIGIT  ; 00-23
 *    time-minute     = 2DIGIT  ; 00-59
 *    time-second     = 2DIGIT  ; 00-58, 00-59, 00-60 based on leap second
 *                              ; rules
 *    time-secfrac    = "." 1*DIGIT
 *    time-numoffset  = ("+" / "-") time-hour ":" time-minute
 *    time-offset     = "Z" / time-numoffset
 *
 *    partial-time    =
 *        time-hour ":" time-minute ":" time-second [time-secfrac]
 *    full-date       = date-fullyear "-" date-month "-" date-mday
 *    full-time       = partial-time time-offset
 *
 *    date-time       = full-date "T" full-time
 *
 * Examples:
 * 1985-04-12T23:20:50.52Z
 *    This represents 20 minutes and 50.52 seconds after the 23rd hour of
 *    April 12th, 1985 in UTC.
 *
 * 1937-01-01T12:00:27.87+00:20
 *    This represents the leap second inserted at the end of 1990, as of noon,
 *    January 1, 1937, Netherlands time. Standard time in the Netherlands was
 *    exactly 19 minutes and 32.13 seconds ahead of UTC by law from 1909-05-01
 *    through 1937-06-30. This time zone cannot be represented exactly using the
 *    HH:MM format, and this timestamp uses the closest representable UTC
 *    offset.
 *
 * See {@link http://www.ietf.org/rfc/rfc3339.txt}
 */

goog.provide('calendarmailer.RfcDateFormatter');

goog.require('goog.date');
goog.require('goog.string');
goog.require('goog.string.StringBuffer');



/**
 * The RFC3339 timestamp formatter.
 * @constructor
 */
calendarmailer.RfcDateFormatter = function() {
};
goog.addSingletonGetter(calendarmailer.RfcDateFormatter);


/**
 * The number of minutes in an hour.
 * @type {number}
 * @private
 */
calendarmailer.RfcDateFormatter.MINS_PER_HOUR_ = 60;


/**
 * Separators used by the standard.
 * @enum {string}
 * @private
 */
calendarmailer.RfcDateFormatter.separators_ = {
  YEAR: '-',
  MONTH: '-',
  DAY: 'T',
  HOUR: ':',
  MINUTE: ':',
  SECOND: '.',
  TZ_PLUS: '+',
  TZ_MINUS: '-',
  TZ_HOUR: ':'
};


/**
 * The fixed widths of each section in the date string.
 * @enum {number}
 * @private
 */
calendarmailer.RfcDateFormatter.widths_ = {
  YEAR: 4,
  MONTH: 2,
  DAY: 2,
  HOUR: 2,
  MINUTE: 2,
  SECOND: 2,
  MILLISECOND: 3,
  TZ_HOUR: 2,
  TZ_MINUTE: 2
};


/**
 * Parses a date string formatted using RFC3339.
 * @param {?string} dateStr The date string to parse.
 * @return {goog.date.DateTime} The parsed date or null if the parse fails.
 */
calendarmailer.RfcDateFormatter.prototype.parse = function(dateStr) {
  // RFC3339 is a stricter set of ISO8601, so we can use the closure parser.
  return dateStr ? goog.date.fromIsoString(dateStr) : null;
};


/**
 * Formats a closure DateLike object into an RFC3339 date string.
 * @param {goog.date.DateLike} date The date to format.
 * @return {string} The formatted string.
 */
calendarmailer.RfcDateFormatter.prototype.format = function(date) {
  var separators = calendarmailer.RfcDateFormatter.separators_;
  var widths = calendarmailer.RfcDateFormatter.widths_;

  var tz = date.getTimezoneOffset();
  var minsPerHr = calendarmailer.RfcDateFormatter.MINS_PER_HOUR_;

  var zeroPad = goog.string.padNumber;

  var buf = new goog.string.StringBuffer();
  buf.append(zeroPad(date.getFullYear(), widths.YEAR, 0)).
      append(separators.YEAR).
      // Month is indexed from 1 in the standard, but returned value is from 0.
      append(zeroPad(date.getMonth() + 1, widths.MONTH, 0)).
      append(separators.MONTH).
      append(zeroPad(date.getDate(), widths.DAY, 0)).
      append(separators.DAY).
      append(zeroPad(date.getHours(), widths.HOUR, 0)).
      append(separators.HOUR).
      append(zeroPad(date.getMinutes(), widths.MINUTE, 0)).
      append(separators.MINUTE).
      append(zeroPad(date.getSeconds(), widths.SECOND, 0)).
      append(separators.SECOND).
      append(zeroPad(date.getMilliseconds(), widths.MILLISECOND, 0)).
      append(tz > 0 ? separators.TZ_MINUS : separators.TZ_PLUS).
      append(
          zeroPad(Math.floor(Math.abs(tz) / minsPerHr), widths.TZ_HOUR, 0)).
      append(separators.TZ_HOUR).
      append(zeroPad(Math.abs(tz) % minsPerHr, widths.TZ_MINUTE, 0));

  return buf.toString();
};
