
/**
 * @fileoverview A renderer for an object containing a list of names.
 */

goog.provide('calendarmailer.picker.ui.NameList');

goog.require('calendarmailer.picker.ui.Picker');



/**
 * A ui object for a calendar object.
 * @constructor
 * @extends {calendarmailer.picker.ui.Picker}
 */
calendarmailer.picker.ui.NameList = function() {
  goog.base(this);

  /**
   * The items in the list.
   * @type {!Array.<!Object>}
   * @private
   */
  this.items_ = [];
};
goog.inherits(calendarmailer.picker.ui.NameList,
    calendarmailer.picker.ui.Picker);


/** @override */
calendarmailer.picker.ui.NameList.prototype.getItems = function() {
  return this.items_;
};


/** @override */
calendarmailer.picker.ui.NameList.prototype.addItem = function(item) {
  if (this.getChild(item.id)) {
    return;
  }
  this.items_.push(item);

  goog.base(this, 'addItem', item, true);
};
