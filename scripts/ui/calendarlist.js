// Copyright 2012 Edwina Mead. All rights reserved.

/**
 * @fileoverview A renderer for a list of calendars.
 */

goog.provide('calendarmailer.ui.CalendarList');
goog.provide('calendarmailer.ui.CalendarList.Event');
goog.provide('calendarmailer.ui.CalendarList.EventType');

goog.require('calendarmailer.soy.calendarlist');
goog.require('goog.events.Event');
goog.require('goog.ui.Button');
goog.require('goog.ui.Checkbox');
goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.Control');
goog.require('soy');



/**
 * A ui object for a list of calendars.
 * @constructor
 * @extends {goog.ui.Control}
 */
calendarmailer.ui.CalendarList = function() {
  goog.base(this);

  /**
   * The calendar feed entry array.
   * @type {!Array.<!Object>}
   * @private
   */
  this.calendarFeedEntries_ = [];

  /**
   * Checkboxes for each calendar in the list.
   * @type {!Array.<!goog.ui.Checkbox>}
   * @private
   */
  this.checkboxes_ = [];

  /**
   * An array of the ids of the selected calendars.
   * @type {!Array.<string>}
   * @private
   */
  this.selectedCalendars_ = [];

  /**
   * The select all button.
   * @type {!goog.ui.Button}
   * @private
   */
  this.selectAllButton_ = new goog.ui.Button(null /* content */);
  this.addChild(this.selectAllButton_);

  /**
   * The select all button.
   * @type {!goog.ui.Button}
   * @private
   */
  this.selectNoneButton_ = new goog.ui.Button(null /* content */);
  this.addChild(this.selectNoneButton_);

  /**
   * The submit button
   * @type {!goog.ui.Button}
   * @private
   */
  this.submitButton_ = new goog.ui.Button(null /* content */);
  this.addChild(this.submitButton_);
};
goog.inherits(calendarmailer.ui.CalendarList, goog.ui.Control);


/**
 * The calendar list submit event type.
 * @enum {string}
 */
calendarmailer.ui.CalendarList.EventType = {
  SUBMIT: 'cse'
};


/**
 * Sets the calendar list object.
 * @param {!Object} obj The object.
 */
calendarmailer.ui.CalendarList.prototype.setListObject = function(obj) {
  this.calendarFeedEntries_ = obj.items;
};


/** @override */
calendarmailer.ui.CalendarList.prototype.createDom = function() {
  this.setElementInternal(soy.renderAsElement(
      calendarmailer.soy.calendarlist.all, {
        calendars: this.calendarFeedEntries_
      }));
};


/** @override */
calendarmailer.ui.CalendarList.prototype.enterDocument = function() {
  var dom = this.getDomHelper();
  var handler = this.getHandler();

  for (var i = 0; i < this.calendarFeedEntries_.length; ++i) {
    var checkbox = new goog.ui.Checkbox(undefined /* opt_checked */, dom);
    checkbox.setId(this.calendarFeedEntries_[i].id);
    checkbox.setLabel(dom.getElement(this.calendarFeedEntries_[i].id +
        '-label'));
    this.addChild(checkbox);
    this.checkboxes_.push(checkbox);
    checkbox.decorate(dom.getElement(this.calendarFeedEntries_[i].id));
  }

  this.selectAllButton_.decorate(dom.getElement('calendar-picker-select-all'));
  handler.listen(this.selectAllButton_, goog.ui.Component.EventType.ACTION,
      this.handleSelectAll_);

  this.selectNoneButton_.decorate(
      dom.getElement('calendar-picker-select-none'));
  handler.listen(this.selectNoneButton_, goog.ui.Component.EventType.ACTION,
      this.handleSelectNone_);

  this.submitButton_.decorate(
      dom.getElement('calendar-picker-submit'));
  handler.listen(this.submitButton_, goog.ui.Component.EventType.ACTION,
      this.handleSubmit_);
};


/**
 * Handles clicks on the select all button.
 * @private
 */
calendarmailer.ui.CalendarList.prototype.handleSelectAll_ = function() {
  for (var i = 0; i < this.checkboxes_.length; ++i) {
    this.checkboxes_[i].setChecked(true);
  }
};


/**
 * Handles clicks on the select none button.
 * @private
 */
calendarmailer.ui.CalendarList.prototype.handleSelectNone_ = function() {
  for (var i = 0; i < this.checkboxes_.length; ++i) {
    this.checkboxes_[i].setChecked(false);
  }
};


/**
 * Handles clicks on the submit button.
 * @private
 */
calendarmailer.ui.CalendarList.prototype.handleSubmit_ = function() {
  var ids = [];
  for (var i = 0; i < this.checkboxes_.length; ++i) {
    if (this.checkboxes_[i].isChecked()) {
      ids.push(this.checkboxes_[i].getId());
    }
  }
  this.selectedCalendars_ = ids;
  this.dispatchEvent(new calendarmailer.ui.CalendarList.Event(ids));
};


/**
 * Gets the selected calendars. This only makes sense once the submit button
 * has been clicked.
 * @return {!Array.<string>} The array of calendar ids.
 */
calendarmailer.ui.CalendarList.prototype.getSelectedCalendars = function() {
  return this.selectedCalendars_;
};



/**
 * The event type which carries information on submit.
 * @param {!Array.<string>} calendars The calendar ids.
 * @constructor
 * @extends {goog.events.Event}
 */
calendarmailer.ui.CalendarList.Event = function(calendars) {
  goog.base(this, calendarmailer.ui.CalendarList.EventType.SUBMIT);

  /**
   * The ids of the calendars to get the events for.
   * @type {!Array.<string>}
   */
  this.calendars = calendars;
};
goog.inherits(calendarmailer.ui.CalendarList.Event, goog.events.Event);

