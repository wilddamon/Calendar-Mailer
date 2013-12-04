/**
 * @fileoverview Generic event class.
 */
goog.provide('calendarmailer.Event');

goog.require('goog.events.Event');



/**
 * @param {string} type
 * @param {string} id
 * @extends {goog.events.Event}
 * @constructor
 */
calendarmailer.Event = function(type, id) {
  goog.base(this, type);

  /** @type {string} */
  this.id = id;
};
goog.inherits(calendarmailer.Event, goog.events.Event);

