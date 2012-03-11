// This file was automatically generated from calendarpicker.soy.
// Please don't edit this file by hand.

goog.provide('calendarmailer.soy.calendarlist');

goog.require('soy');
goog.require('soy.StringBuilder');


/**
 * @param {Object.<string, *>=} opt_data
 * @param {soy.StringBuilder=} opt_sb
 * @return {string}
 * @notypecheck
 */
calendarmailer.soy.calendarlist.all = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<button id="calendar-picker-select-all" class="calendar-picker-select">Select all</button><button id="calendar-picker-select-none" class="calendar-picker-select">Select none</button><div class="calendar-picker-base">');
  var calendarList30 = opt_data.calendars;
  var calendarListLen30 = calendarList30.length;
  for (var calendarIndex30 = 0; calendarIndex30 < calendarListLen30; calendarIndex30++) {
    var calendarData30 = calendarList30[calendarIndex30];
    calendarmailer.soy.calendarlist.calendarRow_({calendar: calendarData30}, output);
  }
  output.append('</div><button id="calendar-picker-submit">Get events!</button>');
  return opt_sb ? '' : output.toString();
};


/**
 * @param {Object.<string, *>=} opt_data
 * @param {soy.StringBuilder=} opt_sb
 * @return {string}
 * @notypecheck
 */
calendarmailer.soy.calendarlist.calendarRow_ = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div class="calendar-picker-row"><div id="', soy.$$escapeHtml(opt_data.calendar.id), '" value="', soy.$$escapeHtml(opt_data.calendar.id), '" class="goog-checkbox"></div><label id="', soy.$$escapeHtml(opt_data.calendar.id), '-label" for="', soy.$$escapeHtml(opt_data.calendar.id), '">', soy.$$escapeHtml(opt_data.calendar.summary), '</label></div>');
  return opt_sb ? '' : output.toString();
};
