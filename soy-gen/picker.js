// This file was automatically generated from picker.soy.
// Please don't edit this file by hand.

goog.provide('calendarmailer.soy.picker');

goog.require('soy');
goog.require('soy.StringBuilder');


/**
 * @param {Object.<string, *>=} opt_data
 * @param {soy.StringBuilder=} opt_sb
 * @return {string}
 * @notypecheck
 */
calendarmailer.soy.picker.all = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div class="picker-base">', (opt_data.title) ? '<div class="picker-title">' + soy.$$escapeHtml(opt_data.title) + '</div>' : '', '<button class="picker-select picker-select-all">Select all</button><button class="picker-select picker-select-none">Select none</button><div class="picker-boxes">');
  var itemList16 = opt_data.items;
  var itemListLen16 = itemList16.length;
  for (var itemIndex16 = 0; itemIndex16 < itemListLen16; itemIndex16++) {
    var itemData16 = itemList16[itemIndex16];
    calendarmailer.soy.picker.row({idprefix: opt_data.idprefix, item: itemData16}, output);
  }
  output.append('</div><button class="picker-submit">Go!</button></div>');
  return opt_sb ? '' : output.toString();
};


/**
 * @param {Object.<string, *>=} opt_data
 * @param {soy.StringBuilder=} opt_sb
 * @return {string}
 * @notypecheck
 */
calendarmailer.soy.picker.row = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div class="picker-row"><div id="', soy.$$escapeHtml(opt_data.idprefix), '-', soy.$$escapeHtml(opt_data.item.id), '" value="', soy.$$escapeHtml(opt_data.item.id), '" name="', soy.$$escapeHtml(opt_data.idprefix), '-', soy.$$escapeHtml(opt_data.item.id), '" class="goog-checkbox goog-checkbox-unchecked"></div><label id="', soy.$$escapeHtml(opt_data.idprefix), '-', soy.$$escapeHtml(opt_data.item.id), '-label" for="', soy.$$escapeHtml(opt_data.idprefix), '-', soy.$$escapeHtml(opt_data.item.id), '" class="picker-label checkbox-label">', soy.$$escapeHtml(opt_data.item.summary), '</label></div>');
  return opt_sb ? '' : output.toString();
};
