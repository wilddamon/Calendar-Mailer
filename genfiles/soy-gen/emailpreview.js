// This file was automatically generated from emailpreview.soy.
// Please don't edit this file by hand.

goog.provide('calendarmailer.soy.email');

goog.require('soy');
goog.require('soydata');


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {string}
 * @notypecheck
 */
calendarmailer.soy.email.all = function(opt_data, opt_ignored) {
  return '<div class="email-preview-title">Sample email</div><div class="email-preview-outer">Hello [name]<br>Your friendly calendar cleanup bot here. I\'ve noticed you are the owner of one or more recurring events that books a room at a particular time for the unending forseeable future. Here are some details of the recurring events you own:<br>[Event name] [Event time(s)] [Room name]<br>If you no longer need any of these rooms, please remove your event to free up the room for other users.<br>Regards, [Operator name]</div>';
};
