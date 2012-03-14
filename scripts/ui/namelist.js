
/**
 * @fileoverview A renderer for an object containing a list of names.
 */

goog.provide('calendarmailer.ui.NameList');

goog.require('calendarmailer.ui.Picker');



/**
 * A ui object for a calendar object.
 * @constructor
 * @extends {calendarmailer.ui.Picker}
 */
calendarmailer.ui.NameList = function() {
  goog.base(this);

  /**
   * The items in the list.
   * @type {!Array.<!Object>}
   * @private
   */
  this.items_ = [];
};
goog.inherits(calendarmailer.ui.NameList, calendarmailer.ui.Picker);


/** @override */
calendarmailer.ui.NameList.prototype.getItems = function() {
  return this.items_;
};


/** @override */
calendarmailer.ui.NameList.prototype.addItem = function(item) {
  if (this.getChild(item.id)) {
    return;
  }
  this.items_.push(item);

  goog.base(this, 'addItem', item, true);
};
