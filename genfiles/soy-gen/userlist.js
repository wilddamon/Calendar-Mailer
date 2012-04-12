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
  output.append('<table class="userlist"><tr><th>Name</th><th>Number of events</th><th>Events</th></tr>');
  var userList56 = opt_data.users;
  var userListLen56 = userList56.length;
  for (var userIndex56 = 0; userIndex56 < userListLen56; userIndex56++) {
    var userData56 = userList56[userIndex56];
    calendarmailer.soy.userlist.row({user: userData56}, output);
  }
  output.append('</table>');
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
  output.append('<tr><td>', soy.$$escapeHtml(opt_data.user.name), '</td><td>', soy.$$escapeHtml(opt_data.user.num_events), '</td><td><table>');
  var eventList68 = opt_data.user.events;
  var eventListLen68 = eventList68.length;
  for (var eventIndex68 = 0; eventIndex68 < eventListLen68; eventIndex68++) {
    var eventData68 = eventList68[eventIndex68];
    output.append('<tr><td>', soy.$$escapeHtml(eventData68.summary), '</td><td>', soy.$$escapeHtml(eventData68.state), '</td></tr>');
  }
  output.append('</table></td></tr>');
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
    var calendarList80 = calendars;
    var calendarListLen80 = calendarList80.length;
    for (var calendarIndex80 = 0; calendarIndex80 < calendarListLen80; calendarIndex80++) {
      var calendarData80 = calendarList80[calendarIndex80];
      calendarmailer.soy.userlist.calendarListRow({calendar: calendarData80}, output);
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
