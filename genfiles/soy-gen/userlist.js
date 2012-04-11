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
  var eventList67 = opt_data.user.events;
  var eventListLen67 = eventList67.length;
  for (var eventIndex67 = 0; eventIndex67 < eventListLen67; eventIndex67++) {
    var eventData67 = eventList67[eventIndex67];
    output.append('<tr><td>', soy.$$escapeHtml(eventData67.summary), '</td><td>', soy.$$escapeHtml(eventData67.state), '</td></tr>');
  }
  output.append('</table></td></tr>');
  return opt_sb ? '' : output.toString();
};
