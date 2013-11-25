/**
 * @fileoverview The cycle picker; the first thing a user sees.
 */
goog.provide('calendarmailer.dashboard.CyclePicker');

goog.require('goog.dom.classes');
goog.require('goog.events.Event');
goog.require('goog.events.EventType');
goog.require('goog.style');
goog.require('goog.ui.Button');
goog.require('goog.ui.Component');



/**
 * The cycle picker.
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @extends {goog.ui.Component}
 * @constructor
 */
calendarmailer.dashboard.CyclePicker = function(opt_domHelper) {
  goog.base(this, opt_domHelper);

  /** @private {!goog.ui.Button} */
  this.createCycleButton_ = new goog.ui.Button(null /* content */);
  this.addChild(this.createCycleButton_);
};
goog.inherits(calendarmailer.dashboard.CyclePicker, goog.ui.Component);


/** @enum {string} */
calendarmailer.dashboard.CyclePicker.EventType = {
  DELETE: 'delete-cycle',
  PICK: 'pick-cycle'
};


/** @override */
calendarmailer.dashboard.CyclePicker.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.createCycleButton_.decorate(document.getElementById('new-cycle-button'));

  this.getHandler().
      listen(this.getElement(), goog.events.EventType.CLICK,
          this.handleCycleClick_).
      listen(this.createCycleButton_,
          goog.ui.Component.EventType.ACTION, this.handleNewCycleClick_);
};


/**
 * Handles clicks on the cycles.
 * @param {!goog.events.BrowserEvent} e The event.
 * @private
 */
calendarmailer.dashboard.CyclePicker.prototype.handleCycleClick_ = function(e) {
  var id = e.target.parentElement.id;
  var isDelete = goog.dom.classes.has(e.target, 'cycle-delete');
  var eventType = isDelete ?
      calendarmailer.dashboard.CyclePicker.EventType.DELETE :
      calendarmailer.dashboard.CyclePicker.EventType.PICK;
  this.dispatchEvent(
      new calendarmailer.dashboard.CyclePicker.Event(eventType, id));
};


/**
 * Handles a click on the new cycle button.
 * @private
 */
calendarmailer.dashboard.CyclePicker.prototype.handleNewCycleClick_ =
    function() {
  window.location = window.location.origin + '/picker';
};


/**
 * @param {boolean} visible
 */
calendarmailer.dashboard.CyclePicker.prototype.setVisible = function(visible) {
  goog.style.setStyle(this.getElement(), 'display', visible ? '' : 'none');
};



/**
 * @param {string} type
 * @param {string} id
 * @extends {goog.events.Event}
 * @constructor
 */
calendarmailer.dashboard.CyclePicker.Event = function(type, id) {
  goog.base(this, type);

  /** @type {string} */
  this.id = id;
};
goog.inherits(calendarmailer.dashboard.CyclePicker.Event, goog.events.Event);
