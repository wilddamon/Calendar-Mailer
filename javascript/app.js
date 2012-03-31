
/**
 * @fileoverview The calendar api management for the mailer app.
 */

goog.provide('calendarmailer.App');

goog.require('calendarmailer.CalendarApi');
goog.require('calendarmailer.CalendarApi.EventType');
goog.require('calendarmailer.Config');
goog.require('calendarmailer.soy.email');
goog.require('calendarmailer.ui.Calendar');
goog.require('calendarmailer.ui.CalendarList');
goog.require('calendarmailer.ui.FilteringWidget');
goog.require('calendarmailer.ui.NameList');
goog.require('calendarmailer.ui.Picker.EventType');
goog.require('goog.array');
goog.require('goog.events.EventHandler');
goog.require('goog.json');
goog.require('goog.net.XhrIo');
goog.require('goog.object');
goog.require('soy');



/**
 * The main calendar app container class.
 * @constructor
 */
calendarmailer.App = function() {
  /**
   * The selected and added events.
   * @type {!Array.<!Object.<string, string>>}
   * @private
   */
  this.selectedEvents_ = [];

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
   * The filter widget.
   * @type {!calendarmailer.ui.FilteringWidget}
   * @private
   */
  this.filter_ = new calendarmailer.ui.FilteringWidget();
  this.filter_.render(document.getElementById('filter'));
  this.filter_.setSectionVisible(
      calendarmailer.ui.FilteringWidget.SectionName.CALENDARS);

  /**
   * The calendar list ui.
   * @type {!calendarmailer.ui.CalendarList}
   * @private
   */
  this.calendarListUi_ = new calendarmailer.ui.CalendarList(this.calendar_);

  /**
   * The map of calendar event uis (containers of calendar events).
   * @type {!Object.<string, !calendarmailer.ui.Calendar>}
   * @private
   */
  this.calendarEventUis_ = {};

  /**
   * A name list.
   * @type {!calendarmailer.ui.NameList}
   * @private
   */
  this.nameList_ = new calendarmailer.ui.NameList();

  /**
   * The xhrio for sending stuff to the server when we're done.
   * @type {!goog.net.XhrIo}
   * @private
   */
  this.io_ = new goog.net.XhrIo();

  this.eventHandler_.
      listen(this.calendar_, calendarmailer.CalendarApi.EventType.LOADED,
          this.handleCalendarApiReady_).
      listen(this.calendar_, calendarmailer.CalendarApi.EventType.LIST_RESULT,
          this.handleGetCalendarsResult_).
      listen(this.calendar_,
          calendarmailer.CalendarApi.EventType.GET_EVENTS_RESULT,
          this.handleGetEventsResult_).
      listen(this.filter_,
          calendarmailer.ui.FilteringWidget.EventType.FILTER_CHANGE,
          this.handleFilterChange_).
      listen(this.filter_,
          calendarmailer.ui.FilteringWidget.EventType.SELECT_ALL,
          this.handleGlobalSelectAll_).
      listen(this.filter_,
          calendarmailer.ui.FilteringWidget.EventType.SELECT_NONE,
          this.handleGlobalSelectNone_).
      listen(this.filter_,
          calendarmailer.ui.FilteringWidget.EventType.SUBMIT,
          this.handleGlobalAddNames_).
      listen(this.calendarListUi_,
          calendarmailer.ui.Picker.EventType.SUBMIT,
          this.handleCalendarListSubmit_).
      listen(this.nameList_, calendarmailer.ui.Picker.EventType.SUBMIT,
          this.handleNamelistSubmit_).
      listen(this.io_, goog.net.EventType.ERROR, this.handleIoError_);
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
  this.calendarListUi_.render(document.getElementById('calendars'));
  this.calendarListUi_.setSubmitCaption('Get events for these calendars!');
};


/**
 * Handles a calendar list submit event from the calendar picker.
 * @param {!calendarmailer.ui.CalendarList.Event} e The event.
 * @private
 */
calendarmailer.App.prototype.handleCalendarListSubmit_ = function(e) {
  this.calendarListUi_.setEnabled(false);
  // Start loading the first calendar which is not loaded yet.
  this.getNextEvents_(e.items);
};


/**
 * Handles list events results.
 * @param {!calendarmailer.CalendarApi.Event} e The event.
 * @private
 */
calendarmailer.App.prototype.handleGetEventsResult_ = function(e) {
  this.calendarListUi_.setVisible(false);
  this.filter_.setSectionVisible(
      calendarmailer.ui.FilteringWidget.SectionName.EVENTS);

  var calendarUi = new calendarmailer.ui.Calendar(e.id, e.title);
  calendarUi.setListObject(e.result);
  this.calendarEventUis_[e.id] = calendarUi;
  calendarUi.render(document.getElementById('eventpickers'));
  calendarUi.setSubmitCaption('Mail the owners of these events!');
  this.getNextEvents_(this.calendarListUi_.getSelectedItems());
};


/**
 * Gets the next set of events.
 * @param {!Array.<Object>} calendars The array of calendars which should
 *     eventually be loaded.
 * @private
 */
calendarmailer.App.prototype.getNextEvents_ = function(calendars) {
  for (var i = 0; i < calendars.length; ++i) {
    if (!this.calendarEventUis_[calendars[i].id]) {
      this.calendar_.getCalendarEvents(calendars[i].id, calendars[i].title);
      break;
    }
  }
};


/**
 * Handles filter change results.
 * @param {!calendarmailer.ui.FilteringWidget.Event} e The event.
 * @private
 */
calendarmailer.App.prototype.handleFilterChange_ = function(e) {
  var filterStr = e.filterStr;
  if (this.calendarListUi_.isEnabled()) {
    this.calendarListUi_.setFilterStr(filterStr);
  }
  goog.object.forEach(this.calendarEventUis_, function(ui) {
    ui.setFilters(e.filterByRepeats, e.filterByLocation);
  }, this);
};


/**
 * Handles a global select all event.
 * @private
 */
calendarmailer.App.prototype.handleGlobalSelectAll_ = function() {
  goog.object.forEach(this.calendarEventUis_, function(ui) {
    ui.selectAll(true);
  }, this);
};


/**
 * Handles a global select none event.
 * @private
 */
calendarmailer.App.prototype.handleGlobalSelectNone_ = function() {
  goog.object.forEach(this.calendarEventUis_, function(ui) {
    ui.selectAll(false);
  }, this);
};


/**
 * Handles a global add names event.
 * @private
 */
calendarmailer.App.prototype.handleGlobalAddNames_ = function() {
  if (this.calendarListUi_.isEnabled()) {
    return;
  }
  this.nameList_.render(document.getElementById('namelist'));
  document.getElementById('email-preview').appendChild(soy.renderAsElement(
      calendarmailer.soy.email.all, {}));
  goog.object.forEach(this.calendarEventUis_, function(ui) {
    if (!ui.isEnabled()) {
      return;
    }
    var events = ui.getSelectedEvents();
    for (var i = 0; i < events.length; ++i) {
      var event = events[i];
      // Sometimes events don't appear to have a creator. If this is the case,
      // log an error and continue. TODO: Log somewhere persistent and/or show a
      // prompt for the admins to investigate.
      if (!event.creator) {
        console.log('event without creator! ID: ' + event.id);
        continue;
      }
      var displayName = event.creator.displayName ?
          event.creator.displayName + ' (' + event.creator.email + ')' :
          event.creator.email;
      this.nameList_.addItem({
        id: event.creator.email,
        summary: displayName
      });
    }
    goog.array.extend(this.selectedEvents_, events);
    ui.setEnabled(false);
  }, this);
  this.nameList_.selectAll(true);
};


/**
 * Submits the names and the corresponding events to the server.
 * @private
 */
calendarmailer.App.prototype.handleNamelistSubmit_ = function() {
  window.console.log('submitting events...');
  // Compiles the list of people to be emailed and their events.
  var names = [];
  goog.array.forEach(this.nameList_.getSelectedItems(), function(item) {
    names.push(item.id);
  }, this);
  window.console.log(names);
  var events = this.selectedEvents_;
  var obj = {'names': names, 'events': events, cycleId: null};
  this.io_.send('/submitevents',
      'POST', goog.json.serialize(obj),
      {'content-type': 'application/json'});
};


/**
 * Resets the IO so another request can be sent.
 * @private
 */
calendarmailer.App.prototype.handleIoError_ = function() {
  goog.dispose(this.io_);
  this.io_ = new goog.net.XhrIo();
};


// Bootstrap functions.
function initApp() {
  var app = new calendarmailer.App();
}


/**
 * Onload handler.
 */
window.onload = initApp;
