/**
 * @fileoverview The cycle picker; the first thing a user sees.
 */
goog.provide('calendarmailer.dashboard.CyclePicker');

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

  /**
   * The create new cycle button.
   * @type {!goog.ui.Button}
   * @private
   */
  this.createCycleButton_ = new goog.ui.Button(null /* content */);
  this.createCycleButton_.decorate(document.getElementById('new-cycle-button'));

};
goog.inherits(calendarmailer.dashboard.CyclePicker, goog.ui.Component);


/** @enum {string} */
calendarmailer.dashboard.CyclePicker.EventType = {
  CYCLE: 'cycle'
};


/** @override */
calendarmailer.dashboard.CyclePicker.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

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
  var target = e.target.parentElement.id;
  if (target) {
    this.dispatchEvent(
        new calendarmailer.dashboard.CyclePicker.PickEvent(target));
  }
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
 * A pick event.
 * @param {string} id The ID of the cycle that was picked.
 * @extends {goog.events.Event}
 * @constructor
 */
calendarmailer.dashboard.CyclePicker.PickEvent = function(id) {
  goog.base(this, calendarmailer.dashboard.CyclePicker.EventType.CYCLE);

  /** @type {string} */
  this.id = id;
};
goog.inherits(calendarmailer.dashboard.CyclePicker.PickEvent,
    goog.events.Event);
