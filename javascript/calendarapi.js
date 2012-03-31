// Copyright 2012 Edwina Mead. All rights reserved.

/**
 * @fileoverview The calendar api management for the mailer app.
 */

goog.provide('calendarmailer.CalendarApi');
goog.provide('calendarmailer.CalendarApi.EventType');

goog.require('goog.Timer');
goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');
goog.require('goog.net.jsloader');
goog.require('goog.string');



/**
 * Contains all the messiness for communicating with the calendar api.
 * Assumes that the gapi library has been loaded elsewhere.
 * @param {!calendarmailer.Config} config The config.
 * @constructor
 * @extends {goog.events.EventTarget}
 */
calendarmailer.CalendarApi = function(config) {
  goog.base(this);

  /**
   * The config object.
   * @type {!calendarmailer.Config}
   * @private
   */
  this.config_ = config;

  goog.exportSymbol('c_api_cb',
      goog.bind(this.doAuth_, this));
};
goog.inherits(calendarmailer.CalendarApi, goog.events.EventTarget);


/**
 * Event types.
 * @enum {string}
 */
calendarmailer.CalendarApi.EventType = {
  GET_EVENTS_RESULT: 'gev',
  LIST_RESULT: 'lr',
  LOADED: 'l'
};


/**
 * Object names of api pieces.
 * @enum {string}
 * @private
 */
calendarmailer.CalendarApi.objectNames_ = {
  AUTH: 'gapi.auth.authorize',
  GAPI: 'gapi',
  GET_EVENTS: 'gapi.client.calendar.events.list',
  LOAD: 'gapi.client.load',
  LIST: 'gapi.client.calendar.calendarList.list',
  SET_API_KEY: 'gapi.client.setApiKey'
};


/**
 * The maximum number of results to be returned in a single request.
 * @type {number=}
 * @private
 */
calendarmailer.CalendarApi.MAX_RESULTS_;


/**
 * Whether this has been initialized.
 * @type {boolean}
 * @private
 */
calendarmailer.CalendarApi.prototype.isInitialized_ = false;


/**
 * The list calendars request generator function.
 * @type {?function}
 * @private
 */
calendarmailer.CalendarApi.prototype.listCalendars_ = null;


/**
 * The get events request generator function.
 * @type {?function}
 * @private
 */
calendarmailer.CalendarApi.prototype.getEvents_ = null;


/**
 * Kicks off the api loading process.
 */
calendarmailer.CalendarApi.prototype.startLoad = function() {
  if (!window[calendarmailer.CalendarApi.objectNames_.GAPI]) {
    goog.net.jsloader.load(this.config_.getApiUrl() + '?onload=c_api_cb');
  } else {
    this.loadCalendarApi_();
  }
};


/**
 * Does authorization.
 * @private
 */
calendarmailer.CalendarApi.prototype.doAuth_ = function() {
  var setKey = goog.getObjectByName(
      calendarmailer.CalendarApi.objectNames_.SET_API_KEY);
  setKey(this.config_.getApiKey());

  goog.Timer.callOnce(function() {
    var authorize = goog.getObjectByName(
        calendarmailer.CalendarApi.objectNames_.AUTH);
    authorize({
      client_id: this.config_.getClientId(),
      scope: this.config_.getScope(),
      immediate: false
    }, goog.bind(this.loadApi_, this));
  }, 1, this);
};


/**
 * Kicks off the final stage of loading the calendar api.
 * @private
 */
calendarmailer.CalendarApi.prototype.loadApi_ = function() {
  goog.Timer.callOnce(function() {
    var load = goog.getObjectByName(
        calendarmailer.CalendarApi.objectNames_.LOAD);
    load('calendar', 'v3', goog.bind(this.onApiLoaded_, this));
  }, 1, this);
};


/**
 * Finishes the loading and sets all the methods required.
 * @private
 */
calendarmailer.CalendarApi.prototype.onApiLoaded_ = function() {
  this.listCalendars_ = goog.getObjectByName(
      calendarmailer.CalendarApi.objectNames_.LIST);
  this.getEvents_ = goog.getObjectByName(
      calendarmailer.CalendarApi.objectNames_.GET_EVENTS);

  this.isInitialized_ = true;

  this.dispatchEvent(calendarmailer.CalendarApi.EventType.LOADED);
};


/**
 * Triggers a request for the user's list of calendars.
 * @param {string=} opt_pageToken An optional page token to continue loading
 *     after a previous request.
 */
calendarmailer.CalendarApi.prototype.getCalendarList = function(
    opt_pageToken) {
  this.listCalendars_({
    maxResults: calendarmailer.CalendarApi.MAX_RESULTS_,
    pageToken: opt_pageToken
  }).execute(goog.bind(this.handleListResult_, this));
};


/**
 * Handles a list result from the server.
 * @param {!Object} result The result.
 * @private
 */
calendarmailer.CalendarApi.prototype.handleListResult_ = function(result) {
  window.console.log('listed calendars:');
  window.console.log(result);
  this.lastResult = result;
  this.dispatchEvent(new calendarmailer.CalendarApi.Event(
      calendarmailer.CalendarApi.EventType.LIST_RESULT, result));
};


/**
 * Triggers a request for calendar events for the given calendar.
 * @param {string} id The id of the calendar.
 * @param {string} title The title of the calendar.
 * @param {string=} opt_pageToken An optional page token to continue loading
 *     after a previous request.
 */
calendarmailer.CalendarApi.prototype.getCalendarEvents = function(id, title,
    opt_pageToken) {
  this.getEvents_({
    calendarId: id,
    maxResults: calendarmailer.CalendarApi.MAX_RESULTS_,
    timeMin: this.config_.getMinDate(),
    pageToken: opt_pageToken
  }).execute(goog.bind(this.handleGetEventsResult_, this, id, title));
};


/**
 * Handles a get events result from the server.
 * @param {string} id The id of the calendar the result is for.
 * @param {string} title The title of the calendar the result is for.
 * @param {!Object} result The result.
 * @private
 */
calendarmailer.CalendarApi.prototype.handleGetEventsResult_ = function(id,
    title, result) {
  window.console.log('got events:');
  window.console.log(result);
  this.lastResult = result;
  this.dispatchEvent(new calendarmailer.CalendarApi.Event(
      calendarmailer.CalendarApi.EventType.GET_EVENTS_RESULT,
      result, id, title));
};



/**
 * A calendar api event.
 * @param {string} type The event type.
 * @param {!Object} result The result.
 * @param {string=} opt_id The id of the calendar this event refers to.
 * @param {string=} opt_title The title of the calendar this event refers to.
 * @constructor
 * @extends {goog.events.Event}
 */
calendarmailer.CalendarApi.Event = function(type, result, opt_id, opt_title) {
  goog.base(this, type);

  /**
   * The result.
   * @type {!Object}
   */
  this.result = result;

  /**
   * The id of the calendar this event refers to.
   * @type {?string}
   */
  this.id = opt_id || null;

  /**
   * The title of the calendar the event refers to.
   * @type {string=}
   */
  this.title = opt_title;
};
goog.inherits(calendarmailer.CalendarApi.Event, goog.events.Event);
