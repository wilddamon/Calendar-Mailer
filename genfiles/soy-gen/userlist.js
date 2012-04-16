// This file was automatically generated from userlist.soy.
// Please don't edit this file by hand.

goog.provide('calendarmailer.soy.userlist');

goog.require('soy');
goog.require('soy.StringBuilder');


/**
 * @param {Object.<string, *>=} opt_data
 * @param {soy.StringBuilder=} opt_sb
 * @return {string}
 * @notypecheck
 */
calendarmailer.soy.userlist.all = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<table id="userlist-table" class="userlist"><tbody><tr><th>Name</th><th>Total events</th><th>Event name</th><th>Event location</th><th>Start time</th><th>Event recurrence</th><th>User action</th></tr>');
  var userList53 = opt_data.users;
  var userListLen53 = userList53.length;
  for (var userIndex53 = 0; userIndex53 < userListLen53; userIndex53++) {
    var userData53 = userList53[userIndex53];
    calendarmailer.soy.userlist.row({user: userData53}, output);
  }
  output.append('</tbody></table>');
  calendarmailer.soy.userlist.calendarList(opt_data, output);
  return opt_sb ? '' : output.toString();
};


/**
 * @param {Object.<string, *>=} opt_data
 * @param {soy.StringBuilder=} opt_sb
 * @return {string}
 * @notypecheck
 */
calendarmailer.soy.userlist.row = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  var eventList60 = opt_data.user.events;
  var eventListLen60 = eventList60.length;
  for (var eventIndex60 = 0; eventIndex60 < eventListLen60; eventIndex60++) {
    var eventData60 = eventList60[eventIndex60];
    output.append('<tr ', (opt_data.user.num_events == 1) ? '' : (opt_data.user.num_events == 2) ? 'class="userlist-two"' : (opt_data.user.num_events <= 4) ? 'class="userlist-four"' : (opt_data.user.num_events > 4) ? 'class="userlist-lots"' : '', '><td>', soy.$$escapeHtml(opt_data.user.name), '</td><td>', soy.$$escapeHtml(opt_data.user.num_events), '</td><td><a href="', soy.$$escapeHtml(eventData60.link), '">', soy.$$escapeHtml(eventData60.summary), '</a></td><td>', soy.$$escapeHtml(eventData60.location), '</td><td>', (eventData60.startTime) ? soy.$$escapeHtml(eventData60.startTime) : 'All day', '</td><td><ul>');
    var recurStrList87 = eventData60.recurrence;
    var recurStrListLen87 = recurStrList87.length;
    for (var recurStrIndex87 = 0; recurStrIndex87 < recurStrListLen87; recurStrIndex87++) {
      var recurStrData87 = recurStrList87[recurStrIndex87];
      output.append('<li>', soy.$$escapeHtml(recurStrData87), '</li>');
    }
    output.append('</ul></td><td>', soy.$$escapeHtml(eventData60.state), '</td></tr>');
  }
  return opt_sb ? '' : output.toString();
};


/**
 * @param {Object.<string, *>=} opt_data
 * @param {soy.StringBuilder=} opt_sb
 * @return {string}
 * @notypecheck
 */
calendarmailer.soy.userlist.wrappedRow = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<table><tbody>');
  calendarmailer.soy.userlist.row(opt_data, output);
  output.append('</tbody></table>');
  return opt_sb ? '' : output.toString();
};


/**
 * @param {Object.<string, *>=} opt_data
 * @param {soy.StringBuilder=} opt_sb
 * @return {string}
 * @notypecheck
 */
calendarmailer.soy.userlist.calendarList = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<ul id="userlist-calendarlist">');
  if (opt_data.calendars) {
    var calendarList104 = calendars;
    var calendarListLen104 = calendarList104.length;
    for (var calendarIndex104 = 0; calendarIndex104 < calendarListLen104; calendarIndex104++) {
      var calendarData104 = calendarList104[calendarIndex104];
      calendarmailer.soy.userlist.calendarListRow({calendar: calendarData104}, output);
    }
  }
  output.append('</ul>');
  return opt_sb ? '' : output.toString();
};


/**
 * @param {Object.<string, *>=} opt_data
 * @param {soy.StringBuilder=} opt_sb
 * @return {string}
 * @notypecheck
 */
calendarmailer.soy.userlist.calendarListRow = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<li>', soy.$$escapeHtml(opt_data.calendar.summary), '</li>');
  return opt_sb ? '' : output.toString();
};
