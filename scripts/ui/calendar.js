// Copyright 2012 Edwina Mead. All rights reserved.

/**
 * @fileoverview A renderer for a calendar object.
 */

goog.provide('calendarmailer.ui.Calendar');

goog.require('calendarmailer.soy.calendar');
goog.require('goog.ui.Component');



/**
 * A ui object for a calendar object.
 * @param {string} id The id of the calendar this represents.
 * @constructor
 * @extends {goog.ui.Component}
 */
calendarmailer.ui.Calendar = function(id) {
  goog.base(this);

  this.setId(id);

  /**
   * The events this calendar contains.
   * @type {!Object}
   * @private
   */
  this.events_ = [];

    /**
   * Checkboxes for each event in the list.
   * @type {!Array.<!goog.ui.Checkbox>}
   * @private
   */
  this.checkboxes_ = [];

  /**
   * An array of the ids of the selected events.
   * @type {!Array.<string>}
   * @private
   */
  this.selectedEvents_ = [];

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
goog.inherits(calendarmailer.ui.Calendar, goog.ui.Component);


/**
 * Sets the event list object.
 * @param {!Object} obj The object.
 */
calendarmailer.ui.Calendar.prototype.setListObject = function(obj) {
  this.events_ = obj.items;
};


/** @override */
calendarmailer.ui.Calendar.prototype.createDom = function() {
  this.setElementInternal(soy.renderAsElement(
      calendarmailer.soy.calendar.all, {
        calendarId: this.getId(),
        events: this.events_
      }));
};


/** @override */
calendarmailer.ui.Calendar.prototype.enterDocument = function() {
  var dom = this.getDomHelper();
  var handler = this.getHandler();

  for (var i = 0; i < this.events_.length; ++i) {
    var checkbox = new goog.ui.Checkbox(undefined /* opt_checked */, dom);
    checkbox.setId(this.events_[i].id);
    checkbox.setLabel(dom.getElement(this.events_[i].id + '-label'));
    this.addChild(checkbox);
    this.checkboxes_.push(checkbox);
    checkbox.decorate(dom.getElement(this.events_[i].id));
  }

  this.selectAllButton_.decorate(
      dom.getElement('event-picker-select-all-' + this.getId()));
  handler.listen(this.selectAllButton_, goog.ui.Component.EventType.ACTION,
      this.handleSelectAll_);

  this.selectNoneButton_.decorate(
      dom.getElement('event-picker-select-none-' + this.getId()));
  handler.listen(this.selectNoneButton_, goog.ui.Component.EventType.ACTION,
      this.handleSelectNone_);

  this.submitButton_.decorate(
      dom.getElement('event-picker-submit-' + this.getId()));
  handler.listen(this.submitButton_, goog.ui.Component.EventType.ACTION,
      this.handleSubmit_);
};
