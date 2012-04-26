
/**
 * @fileoverview The picker app for the calendar mailer.
 */

goog.provide('calendarmailer.picker.App');

goog.require('calendarmailer.CalendarApi');
goog.require('calendarmailer.Config');
goog.require('calendarmailer.picker.ui.Calendar');
goog.require('calendarmailer.picker.ui.CalendarList');
goog.require('calendarmailer.picker.ui.FilteringWidget');
goog.require('calendarmailer.picker.ui.NameList');
goog.require('calendarmailer.picker.ui.Picker');
goog.require('calendarmailer.soy.email');
goog.require('goog.array');
goog.require('goog.events.EventHandler');
goog.require('goog.json');
goog.require('goog.net.EventType');
goog.require('goog.net.XhrIo');
goog.require('goog.object');
goog.require('goog.soy');
goog.require('goog.style');



/**
 * The main calendar picker app container class.
 * @constructor
 */
calendarmailer.picker.App = function() {
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
   * @type {!calendarmailer.picker.ui.FilteringWidget}
   * @private
   */
  this.filter_ = new calendarmailer.picker.ui.FilteringWidget();
  this.filter_.render(document.getElementById('filter'));
  this.filter_.setSectionVisible(
      calendarmailer.picker.ui.FilteringWidget.SectionName.CALENDARS);

  /**
   * The calendar list ui.
   * @type {!calendarmailer.picker.ui.CalendarList}
   * @private
   */
  this.calendarListUi_ =
      new calendarmailer.picker.ui.CalendarList(this.calendar_);

  /**
   * The map of calendar event uis (containers of calendar events).
   * @type {!Object.<string, !calendarmailer.picker.ui.Calendar>}
   * @private
   */
  this.calendarEventUis_ = {};

  /**
   * A name list.
   * @type {!calendarmailer.picker.ui.NameList}
   * @private
   */
  this.nameList_ = new calendarmailer.picker.ui.NameList();

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
          calendarmailer.picker.ui.FilteringWidget.EventType.FILTER_CHANGE,
          this.handleFilterChange_).
      listen(this.filter_,
          calendarmailer.picker.ui.FilteringWidget.EventType.SELECT_ALL,
          this.handleGlobalSelectAll_).
      listen(this.filter_,
          calendarmailer.picker.ui.FilteringWidget.EventType.SELECT_NONE,
          this.handleGlobalSelectNone_).
      listen(this.filter_,
          calendarmailer.picker.ui.FilteringWidget.EventType.SUBMIT,
          this.handleGlobalAddNames_).
      listen(this.calendarListUi_,
          calendarmailer.picker.ui.Picker.EventType.SUBMIT,
          this.handleCalendarListSubmit_).
      listen(this.nameList_, calendarmailer.picker.ui.Picker.EventType.SUBMIT,
          this.handleNamelistSubmit_).
      listen(this.io_, goog.net.EventType.ERROR, this.handleIoError_).
      listen(this.io_, goog.net.EventType.SUCCESS, this.handleIoSuccess_);
};


/**
 * Handles the calendar api becoming ready.
 * @private
 */
calendarmailer.picker.App.prototype.handleCalendarApiReady_ = function() {
  this.calendar_.getCalendarList();
  var spinner = document.getElementById('spinner');
  goog.style.setStyle(spinner, 'display', '');
};


/**
 * Handles calendar list results.
 * @param {!calendarmailer.CalendarApi.Event} e The event.
 * @private
 */
calendarmailer.picker.App.prototype.handleGetCalendarsResult_ = function(e) {
  this.calendarListUi_.addListObject(e.result);
  if (e.result['nextPageToken']) {
    this.calendar_.getCalendarList(e.result['nextPageToken']);
  } else {
    goog.style.setStyle(spinner, 'display', 'none');
    this.calendarListUi_.render(document.getElementById('calendars'));
    this.calendarListUi_.setSubmitCaption('Get events for these calendars!');
  }
};


/**
 * Handles a calendar list submit event from the calendar picker.
 * @param {!calendarmailer.picker.ui.CalendarList.Event} e The event.
 * @private
 */
calendarmailer.picker.App.prototype.handleCalendarListSubmit_ = function(e) {
  this.calendarListUi_.setEnabled(false);
  // Start loading the first calendar which is not loaded yet.
  this.getNextEvents_(e.items);
  var spinner = document.getElementById('spinner');
  goog.style.setStyle(spinner, 'display', '');
};


/**
 * Handles list events results.
 * @param {!calendarmailer.CalendarApi.Event} e The event.
 * @private
 */
calendarmailer.picker.App.prototype.handleGetEventsResult_ = function(e) {
  var calendarUi = this.calendarEventUis_[e.id];
  if (!calendarUi) {
    calendarUi = new calendarmailer.picker.ui.Calendar(e.id, e.title);
    this.calendarEventUis_[e.id] = calendarUi;
  }
  calendarUi.addListObject(e.result);

  if (e.result['nextPageToken']) {
    this.calendar_.getCalendarEvents(e.id, e.title, e.result['nextPageToken']);
  } else {
    calendarUi.render(document.getElementById('eventpickers'));
    calendarUi.setSubmitCaption('Mail the owners of these events!');
    this.eventHandler_.listen(calendarUi,
        calendarmailer.picker.ui.Picker.EventType.SUBMIT, this.handleAddNames_);
    this.getNextEvents_(this.calendarListUi_.getSelectedItems());
  }
};


/**
 * Gets the next set of events.
 * @param {!Array.<Object>} calendars The array of calendars which should
 *     eventually be loaded.
 * @private
 */
calendarmailer.picker.App.prototype.getNextEvents_ = function(calendars) {
  for (var i = 0; i < calendars.length; ++i) {
    if (!this.calendarEventUis_[calendars[i].id]) {
      this.calendar_.getCalendarEvents(calendars[i].id, calendars[i].title);
      return;
    }
  }
  this.calendarListUi_.setVisible(false);
  this.filter_.setSectionVisible(
      calendarmailer.picker.ui.FilteringWidget.SectionName.EVENTS);

  var spinner = document.getElementById('spinner');
  goog.style.setStyle(spinner, 'display', 'none');
};


/**
 * Handles filter change results.
 * @param {!calendarmailer.picker.ui.FilteringWidget.Event} e The event.
 * @private
 */
calendarmailer.picker.App.prototype.handleFilterChange_ = function(e) {
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
calendarmailer.picker.App.prototype.handleGlobalSelectAll_ = function() {
  goog.object.forEach(this.calendarEventUis_, function(ui) {
    ui.selectAll(true);
  }, this);
};


/**
 * Handles a global select none event.
 * @private
 */
calendarmailer.picker.App.prototype.handleGlobalSelectNone_ = function() {
  goog.object.forEach(this.calendarEventUis_, function(ui) {
    ui.selectAll(false);
  }, this);
};


/**
 * Handles a global add names event.
 * @private
 */
calendarmailer.picker.App.prototype.handleGlobalAddNames_ = function() {
  if (this.calendarListUi_.isEnabled()) {
    return;
  }
  this.showNameList_();
  goog.object.forEach(this.calendarEventUis_, function(ui) {
    if (!ui.isEnabled()) {
      return;
    }
    var selectedEvents = ui.getSelectedEvents();
    this.addNames_(selectedEvents);
    ui.setEnabled(false);
    goog.array.extend(this.selectedEvents_,
        this.translateEvents_(ui.getId(), selectedEvents));
  }, this);
  this.nameList_.selectAll(true);
};


/**
 * Adds the names from the given calendar to the list of people to notify.
 * @param {!calendarmailer.picker.ui.CalendarList.Event} e The event.
 * @private
 */
calendarmailer.picker.App.prototype.handleAddNames_ = function(e) {
  this.showNameList_();
  var selectedEvents = e.target.getSelectedEvents();
  this.addNames_(selectedEvents);
  e.target.setEnabled(false);
  goog.array.extend(this.selectedEvents_,
      this.translateEvents_(e.target.getId(), selectedEvents));
};


/**
 * Adds the names from the given calendar to the list of people to notify.
 * @param {!Array.<!Object.<string, string>>} events The events to pull the
 *     names from.
 * @private
 */
calendarmailer.picker.App.prototype.addNames_ = function(events) {
  for (var i = 0; i < events.length; ++i) {
    var event = events[i];
    // Sometimes events don't appear to have a creator. If this is the case,
    // log an error and continue. TODO: Log somewhere persistent and/or show a
    // prompt for the admins to investigate.
    if (!event.creator) {
      window.console.log('event without creator! ID: ' + event.id);
      return;
    }
    var displayName, id;
    if (event.organizer) {
      id = event.organizer.email;
      displayName = event.organizer.displayName ?
          event.organizer.displayName + ' (' + event.organizer.email + ')' :
          event.organizer.email;
    } else {
      id = event.creator.email;
      displayName = event.creator.displayName ?
          event.creator.displayName + ' (' + event.creator.email + ')' :
          event.creator.email;
    }
    this.nameList_.addItem({
      id: id,
      summary: displayName
    });
  }
};


/**
 * Shows the name list.
 * @private
 */
calendarmailer.picker.App.prototype.showNameList_ = function() {
  if (!this.nameList_.isInDocument()) {
    this.nameList_.render(document.getElementById('namelist'));
    document.getElementById('email-preview').appendChild(
        goog.soy.renderAsElement(calendarmailer.soy.email.all, {}));
  }
};


/**
 * Submits the names and the corresponding events to the server.
 * @private
 */
calendarmailer.picker.App.prototype.handleNamelistSubmit_ = function() {
  window.console.log('submitting events...');
  // Compiles the list of people to be emailed and their events.
  var names = [];
  goog.array.forEach(this.nameList_.getSelectedItems(), function(item) {
    names.push(item.id);
  }, this);
  window.console.log(names);
  var obj = {
    'names': names,
    'events': this.selectedEvents_,
    'cycleId': this.config_.getCycleId()
  };
  this.nameList_.setEnabled(false);
  this.io_.send('/submitevents',
      'POST', goog.json.serialize(obj),
      {'content-type': 'application/json'});
};


/**
 * Translates and truncates each event in the given events array to the form,
 * using the given calendar ID:
 * {
 *   "owner": event[creator][email]
 *   "calendarId": calendarId,
 *   "eventId": event["id"]
 *   "summary": event["summary"]
 *   "location": event["location"]
 *   "recurrence": event["recurrence"]
 * }
 * @param {string} calendarId The id of the calendar the events are from.
 * @param {!Array.<!Object>} events The calendar events to translate.
 * @return {!Array.<!Object>} The translated events.
 * @private
 */
calendarmailer.picker.App.prototype.translateEvents_ = function(calendarId,
    events) {
  var result = [];
  goog.array.forEach(events, function(event) {
    // Sometimes events don't appear to have a creator. If this is the case,
    // log an error and continue. TODO: Log somewhere persistent and/or show a
    // prompt for the admins to investigate.
    if (!event.creator) {
      window.console.log('event without creator! ID: ' + event.id);
      return;
    }
    var owner = event.organizer ? event.organizer.email : event.creator.email;
    result.push({
      'owner': owner,
      'calendarId': calendarId,
      'eventId': event.id,
      'summary': event.summary,
      'location': event.location || 'unknown',
      'recurrence': event.recurrence || [],
      'startTime': event.start.dateTime,
      'link': event.htmlLink
    });
  }, this);
  return result;
};


/**
 * Goes back to the dashboard once submission is finished.
 * @private
 */
calendarmailer.picker.App.prototype.handleIoSuccess_ = function() {
  window.location = window.location.origin;
};


/**
 * Resets the IO so another request can be sent.
 * @private
 */
calendarmailer.picker.App.prototype.handleIoError_ = function() {
  goog.dispose(this.io_);
  this.io_ = new goog.net.XhrIo();
  this.nameList_.setEnabled(true);
};


// Bootstrap functions.
function initApp() {
  var app = new calendarmailer.picker.App();
}


/**
 * Onload handler.
 */
window.onload = initApp;
