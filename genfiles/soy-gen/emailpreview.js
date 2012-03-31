// This file was automatically generated from emailpreview.soy.
// Please don't edit this file by hand.

goog.provide('calendarmailer.soy.email');

goog.require('soy');
goog.require('soy.StringBuilder');


/**
 * @param {Object.<string, *>=} opt_data
 * @param {soy.StringBuilder=} opt_sb
 * @return {string}
 * @notypecheck
 */
calendarmailer.soy.email.all = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div class="email-preview-title">Sample email</div><div class="email-preview-outer">Hello [name]<br>Your friendly calendar cleanup bot here. I\'ve noticed you are the owner of one or more recurring events that books a room at a particular time for the unending forseeable future. Here are some details of the recurring events you own:<br>[Event name] [Event time(s)] [Room name]<br>If you no longer need any of these rooms, please remove your event to free up the room for other users.<br>Regards, [Operator name]</div>');
  return opt_sb ? '' : output.toString();
};
