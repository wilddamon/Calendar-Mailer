
/**
 * @fileoverview An RRULE utility class.
 */

goog.provide('calendarmailer.RRuleFormatter');

goog.require('goog.string.StringBuffer');



/**
 * The RRule util class.
 * @constructor
 */
calendarmailer.RRuleFormatter = function() {
};
goog.addSingletonGetter(calendarmailer.RRuleFormatter);


/**
 * String transform from shortened day (RRULE style) and long day.
 * @enum {string}
 * @private
 */
calendarmailer.RRuleFormatter.DAY_STR_ = {
  MO: 'Monday',
  TU: 'Tuesday',
  WE: 'Wednesday',
  TH: 'Thursday',
  FR: 'Friday',
  SA: 'Saturday',
  SU: 'Sunday'
};


/**
 * String transform from shortened frequency (RRULE style) and long frequency.
 * @enum {string}
 * @private
 */
calendarmailer.RRuleFormatter.FREQUENCY_STR_ = {
  DAILY: 'Daily',
  WEEKLY: 'Weekly',
  MONTHLY: 'Monthly',
  YEARLY: 'Yearly'
};


/**
 * String transform from frequency to 'in X [days,months,years]
 * @enum {string}
 * @private
 */
calendarmailer.RRuleFormatter.INTERVAL_STR_ = {
  Daily: 'days',
  Weekly: 'weeks',
  Monthly: 'months',
  Yearly: 'years'
};


/**
 * String transform from a number to a string for the 'xth'.
 * @type {!Array.<string>}
 * @private
 */
calendarmailer.RRuleFormatter.XTH_STR_ = [
  'first',
  'second',
  'third',
  'fourth',
  'fifth'
];


/**
 * Prints a pretty version of the given rrule string.
 * @param {string} rruleStr The rrule string.
 * @return {string} The pretty human-readable version.
 */
calendarmailer.RRuleFormatter.prototype.prettyPrint = function(rruleStr) {
  var ruleStr = rruleStr.split(':')[1]; // Removes RRULE:
  var parts = ruleStr.split(';');
  var frequency, interval, dayStr;
  for (var i = 0; i < parts.length; ++i) {
    var vals = parts[i].split('=');
    if (vals[0] == 'FREQ') {
      frequency = calendarmailer.RRuleFormatter.FREQUENCY_STR_[vals[1]];
    } else if (vals[0] == 'INTERVAL') {
      interval = parseInt(vals[1], 10);
    } else if (vals[0] == 'BYDAY') {
      dayStr = vals[1];
    }
  }

  var buf = new goog.string.StringBuffer();
  if (interval) {
    buf.append('Every ').append(interval).append(' ').
        append(calendarmailer.RRuleFormatter.INTERVAL_STR_[frequency]);
  } else {
    buf.append(frequency);
  }
  if (frequency == calendarmailer.RRuleFormatter.FREQUENCY_STR_.WEEKLY) {
    var days = dayStr.split(',');
    // Must be at least one day.
    buf.append(' on ').append(calendarmailer.RRuleFormatter.DAY_STR_[days[0]]);
    for (var i = 1; i < dayStr.length - 1; ++i) {
      buf.append(', ').append(calendarmailer.RRuleFormatter.DAY_STR_[days[i]]);
    }
    if (days.length > 1) {
      buf.append(' and ').
          append(calendarmailer.RRuleFormatter.DAY_STR_[days[days.length - 1]]);
    }
  } else if (frequency ==
      calendarmailer.RRuleFormatter.FREQUENCY_STR_.MONTHLY) {
    if (dayStr) {
      var weeknum = parseInt(dayStr[0], 10);
      var day = dayStr.substr(1, 2);
      buf.append(' on the ').
          append(calendarmailer.RRuleFormatter.XTH_STR_[weeknum]).
          append(' ').
          append(calendarmailer.RRuleFormatter.DAY_STR_[day]);
    }
  }
  return buf.toString();
};
