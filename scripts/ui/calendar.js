
/**
 * @fileoverview A renderer for a calendar object.
 */

goog.provide('calendarmailer.ui.Calendar');

goog.require('calendarmailer.ui.Picker');



/**
 * A ui object for a calendar object.
 * @param {string} id The id of the calendar this represents.
 * @constructor
 * @extends {calendarmailer.ui.Picker}
 */
calendarmailer.ui.Calendar = function(id) {
  goog.base(this);

  this.setId(id);

  /**
   * The events in the calendar.
   * @type {!Array.<!Object>}
   * @private
   */
  this.events_ = [];
};
goog.inherits(calendarmailer.ui.Calendar, calendarmailer.ui.Picker);


/**
 * Sets the event list object.
 * @param {!Object} obj The object.
 */
calendarmailer.ui.Calendar.prototype.setListObject = function(obj) {
  this.events_ = obj.items;
};


/** @override */
calendarmailer.ui.Calendar.prototype.getItems = function() {
  return this.events_;
};


/**
 * Gets an array of actual event objects for all the selected events.
 * @return {!Array.<!Object.<string, string>>} The names and emails.
 */
calendarmailer.ui.Calendar.prototype.getSelectedEvents = function() {
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
 * @param {boolean} filter Whether to filter.
 */
calendarmailer.ui.Calendar.prototype.setFilterByRepeating = function(filter) {
  var checkboxes = this.checkboxes;
  var showAll = !filter;
  for (var i = 0; i < checkboxes.length; ++i) {
    var box = checkboxes[i];
    var show = showAll ||
        this.getUnendingRecurrence_(this.events_[i].recurrence);
    this.showBox(box, show);
  }
};


/**
 * Checks to see if the given recurrence rule is unending.
 * @param {Array.<string>=} recurrence The recurrence rule.
 * @return {boolean} Whether the rule is unending. False if null or undefined.
 * @private
 */
calendarmailer.ui.Calendar.prototype.getUnendingRecurrence_ =
    function(recurrence) {
  if (!recurrence) {
    return false;
  }
  for (var i = 0; i < recurrence.length; ++i) {
    if (!goog.string.contains(recurrence[i], 'COUNT') &&
        !goog.string.contains(recurrence[i], 'UTNTIL')) {
        return true;
    }
  }
  return false;
};
