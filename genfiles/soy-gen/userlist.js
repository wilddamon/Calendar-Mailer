// This file was automatically generated from userlist.soy.
// Please don't edit this file by hand.

goog.provide('calendarmailer.soy.userlist');

goog.require('soy');
goog.require('soydata');


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {string}
 * @notypecheck
 */
calendarmailer.soy.userlist.all = function(opt_data, opt_ignored) {
  var output = '<table id="userlist-table" class="userlist"><tbody><tr><th>email</th><th>TotalEvents</th><th>EventName</th><th>EventLink</th><th>EventLocation</th><th>StartTime</th><th>EventRecurrence</th><th>UserAction</th></tr>';
  var userList53 = opt_data.users;
  var userListLen53 = userList53.length;
  for (var userIndex53 = 0; userIndex53 < userListLen53; userIndex53++) {
    var userData53 = userList53[userIndex53];
    output += calendarmailer.soy.userlist.row({user: userData53});
  }
  output += '</tbody></table>' + calendarmailer.soy.userlist.calendarList(opt_data);
  return output;
};


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {string}
 * @notypecheck
 */
calendarmailer.soy.userlist.row = function(opt_data, opt_ignored) {
  var output = '';
  var eventList60 = opt_data.user.events;
  var eventListLen60 = eventList60.length;
  for (var eventIndex60 = 0; eventIndex60 < eventListLen60; eventIndex60++) {
    var eventData60 = eventList60[eventIndex60];
    output += '<tr ' + ((opt_data.user.num_events == 1) ? '' : (opt_data.user.num_events == 2) ? 'class="userlist-two"' : (opt_data.user.num_events <= 4) ? 'class="userlist-four"' : (opt_data.user.num_events > 4) ? 'class="userlist-lots"' : '') + '><td>' + soy.$$escapeHtml(opt_data.user.name) + '</td><td>' + soy.$$escapeHtml(opt_data.user.num_events) + '</td><td><a href="' + soy.$$escapeHtml(eventData60.link) + '">' + soy.$$escapeHtml(eventData60.summary) + '</a></td><td>' + soy.$$escapeHtml(eventData60.link) + '</td><td>' + soy.$$escapeHtml(eventData60.location) + '</td><td>' + ((eventData60.startTime) ? soy.$$escapeHtml(eventData60.startTime) : 'All day') + '</td><td>';
    var recurStrList89 = eventData60.recurrence;
    var recurStrListLen89 = recurStrList89.length;
    for (var recurStrIndex89 = 0; recurStrIndex89 < recurStrListLen89; recurStrIndex89++) {
      var recurStrData89 = recurStrList89[recurStrIndex89];
      output += soy.$$escapeHtml(recurStrData89) + ',';
    }
    output += '</td><td>' + soy.$$escapeHtml(eventData60.state) + '</td></tr>';
  }
  return output;
};


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {string}
 * @notypecheck
 */
calendarmailer.soy.userlist.wrappedRow = function(opt_data, opt_ignored) {
  return '<table><tbody>' + calendarmailer.soy.userlist.row(opt_data) + '</tbody></table>';
};


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {string}
 * @notypecheck
 */
calendarmailer.soy.userlist.calendarList = function(opt_data, opt_ignored) {
  return '<table class="userlist"><tbody id="userlist-calendarlist"><th>Calendar name</th><th>Number of events</th></tbody></table>';
};


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {string}
 * @notypecheck
 */
calendarmailer.soy.userlist.wrappedCalendarListRow = function(opt_data, opt_ignored) {
  return '<table><tbody><td>' + soy.$$escapeHtml(opt_data.calendar.summary) + '</td><td>' + soy.$$escapeHtml(opt_data.numEvents) + '</td></tbody></table>';
};
