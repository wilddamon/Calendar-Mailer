/**
 * @fileoverview The cycle picker; the first thing a user sees.
 */
goog.provide('calendarmailer.dashboard.CyclePicker');

goog.require('calendarmailer.Event');
goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.dom.classes');
goog.require('goog.events');
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
  DELETE: goog.events.getUniqueId('delete-cycle'),
  PICK: goog.events.getUniqueId('pick-cycle')
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
  this.dispatchEvent(new calendarmailer.Event(eventType, id));
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
 * @param {string} id
 * @param {string} title
 */
calendarmailer.dashboard.CyclePicker.prototype.setCycleTitle = function(id,
    title) {
  var cycleEl = document.getElementById(id);
  if (cycleEl) {
    var titleEl = goog.dom.getElementByClass('cycle-name', cycleEl);
    goog.dom.setTextContent(titleEl, title);
  }
};


/**
 * @param {string} id
 */
calendarmailer.dashboard.CyclePicker.prototype.removeCycle = function(id) {
  goog.dom.removeNode(document.getElementById(id));
  if (!goog.dom.getChildren(this.getElement()).length) {
    goog.dom.appendChild(this.getElement(),
        goog.dom.createDom(goog.dom.TagName.DIV, 'cycle empty-cycle',
        'You have no cycles. Create one?'));
  }
};

