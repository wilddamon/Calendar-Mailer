// Copyright 2012 Edwina Mead. All rights reserved.

/**
 * @fileoverview A renderer for a list of calendars.
 */

goog.provide('calendarmailer.picker.ui.CalendarList');

goog.require('calendarmailer.picker.ui.Picker');
goog.require('goog.array');
goog.require('goog.string');



/**
 * A ui object for a list of calendars.
 * @constructor
 * @extends {calendarlist.ui.Picker}
 */
calendarmailer.picker.ui.CalendarList = function() {
  goog.base(this);

  /**
   * The calendar feed entry array.
   * @type {!Array.<!Object>}
   * @private
   */
  this.calendarFeedEntries_ = [];
};
goog.inherits(calendarmailer.picker.ui.CalendarList,
    calendarmailer.picker.ui.Picker);


/**
 * Sets the calendar list object.
 * @param {!Object} obj The object.
 */
calendarmailer.picker.ui.CalendarList.prototype.addListObject = function(obj) {
  var items = obj.items;
  goog.array.extend(this.calendarFeedEntries_, items);
  goog.array.removeDuplicates(this.calendarFeedEntries_);
  goog.array.sort(this.calendarFeedEntries_, function(item1, item2) {
    return goog.string.caseInsensitiveCompare(item1.summary, item2.summary);
  });
};


/** @override */
calendarmailer.picker.ui.CalendarList.prototype.getItems = function() {
  return this.calendarFeedEntries_;
};


/**
 * Sets the filter string for the name of the contained calendars.
 * @param {string} str The string to filter by.
 */
calendarmailer.picker.ui.CalendarList.prototype.setFilterStr = function(str) {
  var checkboxes = this.checkboxes;
  var showAll = str.length == 0;
  for (var i = 0; i < checkboxes.length; ++i) {
    var box = checkboxes[i];
    var show = showAll || goog.string.contains(
        this.calendarFeedEntries_[i].summary.toLowerCase(),
        str.toLowerCase());
    this.showBox(box, show);
  }
};
