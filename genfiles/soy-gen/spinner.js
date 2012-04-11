// This file was automatically generated from spinner.soy.
// Please don't edit this file by hand.

goog.provide('calendarmailer.soy.spinner');

goog.require('soy');
goog.require('soy.StringBuilder');


/**
 * @param {Object.<string, *>=} opt_data
 * @param {soy.StringBuilder=} opt_sb
 * @return {string}
 * @notypecheck
 */
calendarmailer.soy.spinner.spinner = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<p class="spinner">Please wait.</p>');
  return opt_sb ? '' : output.toString();
};
