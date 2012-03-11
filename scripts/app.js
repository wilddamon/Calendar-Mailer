// Copyright 2012 Edwina Mead. All rights reserved.

/**
 * @fileoverview The calendar api management for the mailer app.
 */

goog.provide('calendarmailer.App');

goog.require('calendarmailer.CalendarApi');
goog.require('calendarmailer.CalendarApi.EventType');
goog.require('calendarmailer.Config');
goog.require('calendarmailer.ui.Calendar');
goog.require('calendarmailer.ui.CalendarList');
goog.require('goog.events.EventHandler');



/**
 * The main calendar app container class.
 * @constructor
 */
calendarmailer.App = function() {

  /**
   * The config object.
   * @type {!calendarmailer.Config}
   * @private
   */
  this.config_ = new calendarmailer.Config();

  /**
   * The event handler.
   * @type {!goog.events.EventHandler}
   * @private
   */
  this.eventHandler_ = new goog.events.EventHandler(this);

  /**
   * The calendar api wrapper.
   * @type {!calandermailer.CalendarApi}
   * @private
   */
  this.calendar_ = new calendarmailer.CalendarApi(this.config_);
  this.calendar_.startLoad();

  /**
   * The calendar list ui.
   * @type {!calendarmailer.ui.CalendarList}
   * @private
   */
  this.calendarListUi_ = new calendarmailer.ui.CalendarList(this.calendar_);

  /**
   * The array of calendar event uis (containers of calendar events).
   * @type {!Object.<string, !calendarmailer.ui.Calendar>}
   * @private
   */
  this.calendarEventUis_ = {};

  this.eventHandler_.
      listen(this.calendar_, calendarmailer.CalendarApi.EventType.LOADED,
          this.handleCalendarApiReady_).
      listen(this.calendar_, calendarmailer.CalendarApi.EventType.LIST_RESULT,
          this.handleGetCalendarsResult_).
      listen(this.calendar_,
          calendarmailer.CalendarApi.EventType.GET_EVENTS_RESULT,
          this.handleGetEventsResult_).
      listen(this.calendarListUi_,
          calendarmailer.ui.CalendarList.EventType.SUBMIT,
          this.handleCalendarListSubmit_);

  /*
   * This element will have the contents of the app placed inside it.
   * @type {!Element}
   * @private
   */
  this.contentEl_ = document.getElementById('content');
};


/**
 * Handles the calendar api becoming ready.
 * @private
 */
calendarmailer.App.prototype.handleCalendarApiReady_ = function() {
  window.console.log('getting list...');
  this.calendar_.getCalendarList();
};


/**
 * Handles calendar list results.
 * @param {!calendarmailer.CalendarApi.Event} e The event.
 * @private
 */
calendarmailer.App.prototype.handleGetCalendarsResult_ = function(e) {
  this.calendarListUi_.setListObject(e.result);
  this.calendarListUi_.render(this.contentEl_);
};


/**
 * Handles a calendar list submit event from the calendar picker.
 * @param {!calendarmailer.ui.CalendarList.Event} e The event.
 * @private
 */
calendarmailer.App.prototype.handleCalendarListSubmit_ = function(e) {
this.calendarListUi_.setVisible(false);
  // Start loading the first calendar which is not loaded yet.
  this.getNextEvents_(e.calendars);
};


/**
 * Handles list events results.
 * @param {!calendarmailer.CalendarApi.Event} e The event.
 * @private
 */
calendarmailer.App.prototype.handleGetEventsResult_ = function(e) {
  var calendarUi = new calendarmailer.ui.Calendar(e.id);
  calendarUi.setListObject(e.result);
  this.calendarEventUis_[e.id] = calendarUi;
  calendarUi.render();
  this.getNextEvents_(this.calendarListUi_.getSelectedCalendars());
};


/**
 * Gets the next set of events.
 * @param {!Array.<string>} calendars The array of calendars which should
 *     eventually be loaded.
 * @private
 */
calendarmailer.App.prototype.getNextEvents_ = function(calendars) {
  for (var i = 0; i < calendars.length; ++i) {
    if (!this.calendarEventUis_[calendars[i]]) {
      this.calendar_.getCalendarEvents(calendars[i]);
      break;
    }
  }
};


// Bootstrap functions.
function initApp() {
  var app = new calendarmailer.App();
}

/**
 * Onload handler.
 */
window.onload = initApp;
