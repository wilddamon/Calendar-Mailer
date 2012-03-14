
/**
 * @fileoverview A widget which sets the filtering modes of all the pickers
 * in the app.
 */

goog.provide('calendarmailer.ui.FilteringWidget');
goog.provide('calendarmailer.ui.FilteringWidget.Event');
goog.provide('calendarmailer.ui.FilteringWidget.EventType');

goog.require('calendarmailer.soy.filteringwidget');
goog.require('goog.dom.classes');
goog.require('goog.events.Event');
goog.require('goog.events.EventType');
goog.require('goog.ui.Button');
goog.require('goog.ui.Checkbox');
goog.require('goog.ui.Component');
goog.require('goog.ui.Textarea');
goog.require('soy');



/**
 * A ui widget for setting the global filtering options for the app.
 * @constructor
 * @extends {goog.ui.Component}
 */
calendarmailer.ui.FilteringWidget = function() {
  goog.base(this);

  /**
   * The text area widget.
   * @type {!goog.ui.TextArea}
   * @private
   */
  this.textbox_ = new goog.ui.Textarea('');
  this.addChild(this.textbox_);

  /**
   * The repeating filter checkbox.
   * @type {!goog.ui.Checkbox}
   * @private
   */
  this.repeatCheckbox_ = new goog.ui.Checkbox();
  this.addChild(this.repeatCheckbox_);

  /**
   * The location filter checkbox.
   * @type {!goog.ui.Checkbox}
   * @private
   */
  this.locationCheckbox_ = new goog.ui.Checkbox();
  this.addChild(this.locationCheckbox_);

  /**
   * The select all button.
   * @type {!goog.ui.Button}
   * @private
   */
  this.selectAllButton_ = new goog.ui.Button();
  this.addChild(this.selectAllButton_);

  /**
   * The select none button.
   * @type {!goog.ui.Button}
   * @private
   */
  this.selectNoneButton_ = new goog.ui.Button();
  this.addChild(this.selectNoneButton_);

  /**
   * The submit button
   * @type {!goog.ui.Button}
   * @private
   */
  this.addButton_ = new goog.ui.Button(null /* content */);
  this.addChild(this.addButton_);
};
goog.inherits(calendarmailer.ui.FilteringWidget, goog.ui.Component);


/**
 * Filtering widget event types.
 * @enum {string}
 */
calendarmailer.ui.FilteringWidget.EventType = {
  FILTER_CHANGE: 'fc',
  SELECT_ALL: 'sa',
  SELECT_NONE: 'sn',
  SUBMIT: 'sb'
};


/**
 * The element for the textbox to decorate.
 * @type {!Element}
 * @private
 */
calendarmailer.ui.FilteringWidget.prototype.textboxEl_;


/**
 * The element for the repeating filter checkbox to decorate.
 * @type {!Element}
 * @private
 */
calendarmailer.ui.FilteringWidget.prototype.repeatCheckboxEl_;


/**
 * The element for the location filter checkbox to decorate.
 * @type {!Element}
 * @private
 */
calendarmailer.ui.FilteringWidget.prototype.locationCheckboxEl_;


/**
 * The element for the select all button to decorate.
 * @type {!Element}
 * @private
 */
calendarmailer.ui.FilteringWidget.prototype.selectAllButtonEl_;


/**
 * The element for the select none button to decorate.
 * @type {!Element}
 * @private
 */
calendarmailer.ui.FilteringWidget.prototype.selectNoneButtonEl_;


/**
 * The element for the submit button to decorate.
 * @type {!Element}
 * @private
 */
calendarmailer.ui.FilteringWidget.prototype.submitButtonEl_;


/**
 * Whether the text has been modified.
 * @type {!boolean}
 * @private
 */
calendarmailer.ui.FilteringWidget.prototype.textModified_ = false;


/** @override */
calendarmailer.ui.FilteringWidget.prototype.createDom = function() {
  var dom = this.getDomHelper();

  var el = soy.renderAsElement(calendarmailer.soy.filteringwidget.all, {
  });
  this.setElementInternal(el);

  this.textboxEl_ = dom.getElementByClass('filter-textbox', el);
  this.repeatCheckboxEl_ = dom.getElementByClass('filter-checkbox', el);
  this.locationCheckboxEl_ = dom.getELementByClass('filter-loc-checkbox', el);
  this.selectAllButtonEl_ = dom.getElementByClass('filter-selectall', el);
  this.selectNoneButtonEl_ = dom.getElementByClass('filter-selectnone', el);
  this.addButtonEl_ = dom.getElementByClass('filter-submit', el);
};


/** @override */
calendarmailer.ui.FilteringWidget.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.textbox_.decorate(this.textboxEl_);
  this.repeatCheckbox_.decorate(this.repeatCheckboxEl_);
  this.repeatCheckbox_.setLabel(
      this.getDomHelper().getElement('repeatingfilter-label'));
  this.locationCheckbox_.decorate(this.locationCheckboxEl_);
  this.locationCheckbox_.setLabel(
      this.getDomHelper().getElement('locationfilter-label'));
  this.selectAllButton_.decorate(this.selectAllButtonEl_);
  this.selectNoneButton_.decorate(this.selectNoneButtonEl_);
  this.addButton_.decorate(this.addButtonEl_);

  this.textbox_.setValue('filter calendars by name');

  this.getHandler().
      listen(this.textboxEl_, goog.events.EventType.CLICK,
          this.handleTextboxClick_).
      listen(this.textboxEl_, goog.events.EventType.KEYUP,
          this.handleFilterChange_).
      listen(this.repeatCheckbox_, goog.ui.Component.EventType.CHANGE,
          this.handleFilterChange_).
      listen(this.locationCheckbox_, goog.ui.Component.EventType.CHANGE,
          this.handleFilterChange_).
      listen(this.selectAllButton_, goog.ui.Component.EventType.ACTION,
          this.handleSelectAll_).
      listen(this.selectNoneButton_, goog.ui.Component.EventType.ACTION,
          this.handleSelectNone_).
      listen(this.addButton_, goog.ui.Component.EventType.ACTION,
          this.handleSubmit_);
};


/**
 * Handles clicks on the textbox.
 * @private
 */
calendarmailer.ui.FilteringWidget.prototype.handleTextboxClick_ = function() {
  if (!this.textModified_) {
    this.textModified_ = true;
    goog.dom.classes.enable(this.textboxEl_, 'filter-textbox-active', true);
    this.textbox_.setValue('');
  }
};


/**
 * Handles the filter changing.
 * @private
 */
calendarmailer.ui.FilteringWidget.prototype.handleFilterChange_ = function() {
  window.console.log('handleFilterChange_');
  this.dispatchEvent(new calendarmailer.ui.FilteringWidget.Event(
      calendarmailer.ui.FilteringWidget.EventType.FILTER_CHANGE,
      this.textModified_ ? this.textbox_.getValue() : '',
      this.repeatCheckbox_.isChecked(), this.locationCheckbox_.isChecked()));
};


/**
 * Handles a global select all event.
 * @private
 */
calendarmailer.ui.FilteringWidget.prototype.handleSelectAll_ = function() {
  this.dispatchEvent(calendarmailer.ui.FilteringWidget.EventType.SELECT_ALL);
};


/**
 * Handles a global select none event.
 * @private
 */
calendarmailer.ui.FilteringWidget.prototype.handleSelectNone_ = function() {
  this.dispatchEvent(calendarmailer.ui.FilteringWidget.EventType.SELECT_NONE);
};


/**
 * Handles a global submit event.
 * @private
 */
calendarmailer.ui.FilteringWidget.prototype.handleSubmit_ = function() {
  this.dispatchEvent(calendarmailer.ui.FilteringWidget.EventType.SUBMIT);
};



/**
 * Filter widget event.
 * @param {string} type The event type.
 * @param {string=} opt_strFilter Optional string for filtering by name.
 * @param {boolean=} opt_filterRepeats Optionally indicate whether events should
 *     be filtered by whether they are repeating.
 * @param {boolean=} opt_filterLocation Optionally indicate whether events
 *     should be filtered by whether they have a location.
 * @constructor
 * @extends {goog.events.Event}
 */
calendarmailer.ui.FilteringWidget.Event = function(type, opt_strFilter,
    opt_filterRepeats, opt_filterLocation) {
  goog.base(this, type);

  this.filterStr = opt_strFilter || '';

  this.filterByRepeats = !!opt_filterRepeats;

  this.filterByLocation = !!opt_filterLocation;
};
goog.inherits(calendarmailer.ui.FilteringWidget.Event, goog.events.Event);
