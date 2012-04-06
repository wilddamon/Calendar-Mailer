// Copyright 2012 Edwina Mead. All rights reserved.

/**
 * @fileoverview A renderer for a list of calendars.
 */

goog.provide('calendarmailer.ui.CalendarList');

goog.require('calendarmailer.ui.Picker');
goog.require('goog.array');
goog.require('goog.string');



/**
 * A ui object for a list of calendars.
 * @constructor
 * @extends {calendarlist.ui.Picker}
 */
calendarmailer.ui.CalendarList = function() {
  goog.base(this);

  /**
   * The calendar feed entry array.
   * @type {!Array.<!Object>}
   * @private
   */
  this.calendarFeedEntries_ = [];
};
goog.inherits(calendarmailer.ui.CalendarList, calendarmailer.ui.Picker);


/**
 * Sets the calendar list object.
 * @param {!Object} obj The object.
 */
calendarmailer.ui.CalendarList.prototype.setListObject = function(obj) {
  var items = obj.items;
  goog.array.sort(items, function(item1, item2) {
    return goog.string.caseInsensitiveCompare(item1.summary, item2.summary);
  });
  this.calendarFeedEntries_ = items;
};


/** @override */
calendarmailer.ui.CalendarList.prototype.getItems = function() {
  return this.calendarFeedEntries_;
};


/**
 * Sets the filter string for the name of the contained calendars.
 * @param {string} str The string to filter by.
 */
calendarmailer.ui.CalendarList.prototype.setFilterStr = function(str) {
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
