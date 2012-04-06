
/**
 * @fileoverview A renderer for a calendar object.
 */

goog.provide('calendarmailer.picker.ui.Calendar');

goog.require('calendarmailer.picker.ui.Picker');
goog.require('goog.array');
goog.require('goog.string');



/**
 * A ui object for a calendar object.
 * @param {string} id The id of the calendar this represents.
 * @param {string=} opt_title The title for the Calendar.
 * @constructor
 * @extends {calendarmailer.picker.ui.Picker}
 */
calendarmailer.picker.ui.Calendar = function(id, opt_title) {
  goog.base(this, opt_title);

  this.setId(id);

  /**
   * The events in the calendar.
   * @type {!Array.<!Object>}
   * @private
   */
  this.events_ = [];
};
goog.inherits(calendarmailer.picker.ui.Calendar,
    calendarmailer.picker.ui.Picker);


/** @override */
calendarmailer.picker.ui.Calendar.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.showTitle(true);
};


/**
 * Sets the event list object.
 * @param {!Object} obj The object.
 */
calendarmailer.picker.ui.Calendar.prototype.setListObject = function(obj) {
  var items = [];
  for (var i = 0; i < obj.items.length; ++i) {
    var item = obj.items[i];
    if (!(item.status && item.status == 'cancelled')) {
      items.push(item);
    }
  }

  goog.array.sort(items, function(item1, item2) {
    return item1.created < item2.created;
  });
  this.events_ = items;
};


/** @override */
calendarmailer.picker.ui.Calendar.prototype.getItems = function() {
  return this.events_;
};


/**
 * Gets an array of actual event objects for all the selected events.
 * @return {!Array.<!Object.<string, string>>} The names and emails.
 */
calendarmailer.picker.ui.Calendar.prototype.getSelectedEvents = function() {
  var result = [];
  for (var i = 0; i < this.checkboxes.length; ++i) {
    if (this.checkboxes[i].isChecked()) {
      result.push(this.events_[i]);
    }
  }
  return result;
};


/**
 * Sets whether to filter by repeating events.
 * @param {boolean} byRepeating Whether to filter by repeating events.
 */
calendarmailer.picker.ui.Calendar.prototype.setFilters = function(
    byRepeating) {
  var checkboxes = this.checkboxes;
  var showAll = !byRepeating;
  for (var i = 0; i < checkboxes.length; ++i) {
    var box = checkboxes[i];
    var show = showAll ||
        this.getUnendingRecurrence_(this.events_[i].recurrence);
    this.showBox(box, show);
  }
};


/**
 * Checks to see if the given recurrence rule is unending.
 * @param {Array.<string>=} opt_recurrence The recurrence rule.
 * @return {boolean} Whether the rule is unending. False if null or undefined.
 * @private
 */
calendarmailer.picker.ui.Calendar.prototype.getUnendingRecurrence_ =
    function(opt_recurrence) {
  if (!opt_recurrence) {
    return false;
  }
  for (var i = 0; i < opt_recurrence.length; ++i) {
    if (!goog.string.contains(opt_recurrence[i], 'COUNT') &&
        !goog.string.contains(opt_recurrence[i], 'UTNTIL')) {
      return true;
    }
  }
  return false;
};
