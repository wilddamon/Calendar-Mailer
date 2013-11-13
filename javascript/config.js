

goog.provide('calendarmailer.Config');

goog.require('calendarmailer.RfcDateFormatter');
goog.require('goog.Uri');
goog.require('goog.date.DateTime');



/**
 * The config object for the calendar mailer.
 * @constructor
 */
calendarmailer.Config = function() {
  /** @private {string} */
  this.apiKey_ = 'AIzaSyCApKI3skdxt1QaVS-KKedN1E2n1MZUyyk';

  /** @private {string} */
  this.clientId_ = '673691169320';

  /** @private {string */
  this.scope_ = 'https://www.googleapis.com/auth/calendar.readonly';

  /** @private {string} */
  this.apiUrl_ = 'https://apis.google.com/js/client.js';

  var uri = new goog.Uri(window.location.href);

  /** @private {string} */
  this.cycleId_ = uri.getParameterValue('id') || '';

  /** @private {string} */
  this.cycleTitle_ = uri.getParameterValue('title') || '';

  var now = new goog.date.DateTime();
  var nextYear = new goog.date.DateTime();
  nextYear.setFullYear(now.getFullYear() + 1);

  /**
   * The minimum date to use when searching for events.
   * @private {string}
   */
  this.minDate_ = calendarmailer.RfcDateFormatter.getInstance().format(now);

  /**
   * The maximum date to use when searching for events.
   * @private {string}
   */
  this.maxDate_ = calendarmailer.RfcDateFormatter.getInstance().format(
      nextYear);

  /**
   * The maximum number of events to submit using a picker.
   * @private {number}
   * */
  this.maxSubmitEvents_ = 50;
};


/** @return {string} */
calendarmailer.Config.prototype.getApiKey = function() {
  return this.apiKey_;
};


/** @return {string} */
calendarmailer.Config.prototype.getClientId = function() {
  return this.clientId_;
};


/** @return {string} */
calendarmailer.Config.prototype.getScope = function() {
  return this.scope_;
};


/** @return {string} */
calendarmailer.Config.prototype.getApiUrl = function() {
  return this.apiUrl_;
};


/** @return {string} */
calendarmailer.Config.prototype.getCycleId = function() {
  return this.cycleId_;
};


/** @return {string} */
calendarmailer.Config.prototype.getCycleTitle = function() {
  return this.cycleTitle_;
};


/** @return {string} */
calendarmailer.Config.prototype.getMinDate = function() {
  return this.minDate_;
};


/** @return {string} */
calendarmailer.Config.prototype.getMaxDate = function() {
  return this.maxDate_;
};


/** @return {number} */
calendarmailer.Config.prototype.getMaxSubmitEvents = function() {
  return this.maxSubmitEvents_;
};

