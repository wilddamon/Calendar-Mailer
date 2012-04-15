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
  output.append('<table id="userlist-table" class="userlist"><tbody><tr><th>Name</th><th>Number of events</th><th>Events</th></tr>');
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
  output.append('<tr><td>', soy.$$escapeHtml(opt_data.user.name), '</td><td>', soy.$$escapeHtml(opt_data.user.num_events), '</td><td><table><tbody>');
  var eventList65 = opt_data.user.events;
  var eventListLen65 = eventList65.length;
  for (var eventIndex65 = 0; eventIndex65 < eventListLen65; eventIndex65++) {
    var eventData65 = eventList65[eventIndex65];
    output.append('<tr><td>', soy.$$escapeHtml(eventData65.summary), '</td><td>', soy.$$escapeHtml(eventData65.state), '</td></tr>');
  }
  output.append('</tbody></table></td></tr>');
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
    var calendarList81 = calendars;
    var calendarListLen81 = calendarList81.length;
    for (var calendarIndex81 = 0; calendarIndex81 < calendarListLen81; calendarIndex81++) {
      var calendarData81 = calendarList81[calendarIndex81];
      calendarmailer.soy.userlist.calendarListRow({calendar: calendarData81}, output);
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
