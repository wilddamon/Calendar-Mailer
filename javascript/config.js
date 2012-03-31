// Copyright 2012 Edwina Mead. All rights reserved.

goog.provide('calendarmailer.Config');

goog.require('rfctimestamp');



/**
 * The config object for the calendar mailer.
 * @constructor
 */
calendarmailer.Config = function() {
  /**
   * The api key.
   * @type {string}
   * @private
   */
  this.apiKey_ = 'AIzaSyCApKI3skdxt1QaVS-KKedN1E2n1MZUyyk';

  /**
   * The client id.
   * @type {string}
   * @private
   */
  this.clientId_ = '673691169320';

  /**
   * The scope.
   * @type {string}
   * @private
   */
  this.scope_ = 'https://www.googleapis.com/auth/calendar.readonly';

  /**
   * The api url.
   * @type {string}
   * @private
   */
  this.apiUrl_ = 'https://apis.google.com/js/client.js';

  /**
   * Today's date.
   * @type {string}
   * @private
   */
  this.minDate_ = rfctimestamp();
};


/**
 * @return {string} The api key.
 */
calendarmailer.Config.prototype.getApiKey = function() {
  return this.apiKey_;
};


/**
 * @return {string} The client id.
 */
calendarmailer.Config.prototype.getClientId = function() {
  return this.clientId_;
};


/**
 * @return {string} The scope.
 */
calendarmailer.Config.prototype.getScope = function() {
  return this.scope_;
};


/**
 * @return {string} The api url.
 */
calendarmailer.Config.prototype.getApiUrl = function() {
  return this.apiUrl_;
};


/**
 * @return {string} Today's date represented in an iso string.
 */
calendarmailer.Config.prototype.getMinDate = function() {
  return this.minDate_;
};