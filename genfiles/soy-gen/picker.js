// This file was automatically generated from picker.soy.
// Please don't edit this file by hand.

goog.provide('calendarmailer.soy.picker');

goog.require('soy');
goog.require('soydata');


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {string}
 * @notypecheck
 */
calendarmailer.soy.picker.all = function(opt_data, opt_ignored) {
  var output = '<div class="picker-base">' + ((opt_data.title) ? '<div class="picker-title picker-title-hidden">' + soy.$$escapeHtml(opt_data.title) + '</div>' : '') + '<button class="picker-select picker-select-all action-button">Select all</button><button class="picker-select picker-select-none action-button">Select none</button><div class="picker-boxes">';
  var itemList16 = opt_data.items;
  var itemListLen16 = itemList16.length;
  for (var itemIndex16 = 0; itemIndex16 < itemListLen16; itemIndex16++) {
    var itemData16 = itemList16[itemIndex16];
    output += (! (itemData16.status && itemData16.status.cancelled)) ? calendarmailer.soy.picker.row({idprefix: opt_data.idprefix, item: itemData16}) : '';
  }
  output += '</div><button class="picker-submit primary-button">Go!</button></div>';
  return output;
};


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {string}
 * @notypecheck
 */
calendarmailer.soy.picker.row = function(opt_data, opt_ignored) {
  return '<div class="picker-row"><div id="' + soy.$$escapeHtml(opt_data.idprefix) + '-' + soy.$$escapeHtml(opt_data.item.id) + '" value="' + soy.$$escapeHtml(opt_data.item.id) + '" name="' + soy.$$escapeHtml(opt_data.idprefix) + '-' + soy.$$escapeHtml(opt_data.item.id) + '" class="goog-checkbox goog-checkbox-unchecked"></div><label id="' + soy.$$escapeHtml(opt_data.idprefix) + '-' + soy.$$escapeHtml(opt_data.item.id) + '-label" for="' + soy.$$escapeHtml(opt_data.idprefix) + '-' + soy.$$escapeHtml(opt_data.item.id) + '" class="picker-label checkbox-label">' + ((opt_data.item.summary) ? soy.$$escapeHtml(opt_data.item.summary) : '(No Title)') + '</label></div>';
};
