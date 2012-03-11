// This file was automatically generated from calendareventpicker.soy.
// Please don't edit this file by hand.

goog.provide('calendarmailer.soy.calendar');

goog.require('soy');
goog.require('soy.StringBuilder');


/**
 * @param {Object.<string, *>=} opt_data
 * @param {soy.StringBuilder=} opt_sb
 * @return {string}
 * @notypecheck
 */
calendarmailer.soy.calendar.all = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<button id="event-picker-select-all-', soy.$$escapeHtml(opt_data.calendarId), '" class="event-picker-select">Select all</button><button id="event-picker-select-none-', soy.$$escapeHtml(opt_data.calendarId), '" class="event-picker-select">Select none</button><div class="event-picker-base">');
  var eventList8 = opt_data.events;
  var eventListLen8 = eventList8.length;
  for (var eventIndex8 = 0; eventIndex8 < eventListLen8; eventIndex8++) {
    var eventData8 = eventList8[eventIndex8];
    calendarmailer.soy.calendar.eventRow({event: eventData8}, output);
  }
  output.append('</div><button id="event-picker-submit-', soy.$$escapeHtml(opt_data.calendarId), '">Select to mail!</button>');
  return opt_sb ? '' : output.toString();
};


/**
 * @param {Object.<string, *>=} opt_data
 * @param {soy.StringBuilder=} opt_sb
 * @return {string}
 * @notypecheck
 */
calendarmailer.soy.calendar.eventRow = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div class="event-picker-row"><div id="', soy.$$escapeHtml(opt_data.event.id), '" value="', soy.$$escapeHtml(opt_data.event.id), '" class="goog-checkbox"></div><label id="', soy.$$escapeHtml(opt_data.event.id), '-label" for="', soy.$$escapeHtml(opt_data.event.id), '">', soy.$$escapeHtml(opt_data.event.summary), '</label></div>');
  return opt_sb ? '' : output.toString();
};
