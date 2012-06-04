
/**
 * @fileoverview A widget which sets the filtering modes of all the pickers
 * in the app.
 */

goog.provide('calendarmailer.picker.ui.FilteringWidget');
goog.provide('calendarmailer.picker.ui.FilteringWidget.Event');
goog.provide('calendarmailer.picker.ui.FilteringWidget.EventType');

goog.require('calendarmailer.soy.filteringwidget');
goog.require('goog.dom.classes');
goog.require('goog.events.Event');
goog.require('goog.events.EventType');
goog.require('goog.soy');
goog.require('goog.ui.Button');
goog.require('goog.ui.Checkbox');
goog.require('goog.ui.Component');
goog.require('goog.ui.Textarea');



/**
 * A ui widget for setting the global filtering options for the app.
 * @constructor
 * @extends {goog.ui.Component}
 */
calendarmailer.picker.ui.FilteringWidget = function() {
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
goog.inherits(calendarmailer.picker.ui.FilteringWidget, goog.ui.Component);


/**
 * Filtering widget event types.
 * @enum {string}
 */
calendarmailer.picker.ui.FilteringWidget.EventType = {
  FILTER_CHANGE: 'fc',
  SELECT_ALL: 'sa',
  SELECT_NONE: 'sn',
  SUBMIT: 'sb'
};


/**
 * Section names.
 * @enum {string}
 */
calendarmailer.picker.ui.FilteringWidget.SectionName = {
  CALENDARS: 'filter-calendars',
  EVENTS: 'filter-events',
  SELECT: 'filter-select-control'
};


/**
 * The element for the textbox to decorate.
 * @type {!Element}
 * @private
 */
calendarmailer.picker.ui.FilteringWidget.prototype.textboxEl_;


/**
 * The element for the repeating filter checkbox to decorate.
 * @type {!Element}
 * @private
 */
calendarmailer.picker.ui.FilteringWidget.prototype.repeatCheckboxEl_;


/**
 * The element for the select all button to decorate.
 * @type {!Element}
 * @private
 */
calendarmailer.picker.ui.FilteringWidget.prototype.selectAllButtonEl_;


/**
 * The element for the select none button to decorate.
 * @type {!Element}
 * @private
 */
calendarmailer.picker.ui.FilteringWidget.prototype.selectNoneButtonEl_;


/**
 * The element for the submit button to decorate.
 * @type {!Element}
 * @private
 */
calendarmailer.picker.ui.FilteringWidget.prototype.submitButtonEl_;


/**
 * Whether the text has been modified.
 * @type {!boolean}
 * @private
 */
calendarmailer.picker.ui.FilteringWidget.prototype.textModified_ = false;


/** @override */
calendarmailer.picker.ui.FilteringWidget.prototype.createDom = function() {
  var dom = this.getDomHelper();

  var el = goog.soy.renderAsElement(calendarmailer.soy.filteringwidget.all, {
  });
  this.setElementInternal(el);

  this.textboxEl_ = dom.getElementByClass('filter-textbox', el);
  this.repeatCheckboxEl_ = dom.getElementByClass('filter-checkbox', el);
  this.selectAllButtonEl_ = dom.getElementByClass('filter-selectall', el);
  this.selectNoneButtonEl_ = dom.getElementByClass('filter-selectnone', el);
  this.addButtonEl_ = dom.getElementByClass('filter-submit', el);
};


/** @override */
calendarmailer.picker.ui.FilteringWidget.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.textbox_.decorate(this.textboxEl_);
  this.repeatCheckbox_.decorate(this.repeatCheckboxEl_);
  this.repeatCheckbox_.setLabel(
      this.getDomHelper().getElement('repeatingfilter-label'));
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
calendarmailer.picker.ui.FilteringWidget.prototype.handleTextboxClick_ =
    function() {
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
calendarmailer.picker.ui.FilteringWidget.prototype.handleFilterChange_ =
    function() {
  window.console.log('handleFilterChange_');
  this.dispatchEvent(new calendarmailer.picker.ui.FilteringWidget.Event(
      calendarmailer.picker.ui.FilteringWidget.EventType.FILTER_CHANGE,
      this.textModified_ ? this.textbox_.getValue() : '',
      this.repeatCheckbox_.isChecked()));
};


/**
 * Handles a global select all event.
 * @private
 */
calendarmailer.picker.ui.FilteringWidget.prototype.handleSelectAll_ =
    function() {
  this.dispatchEvent(
      calendarmailer.picker.ui.FilteringWidget.EventType.SELECT_ALL);
};


/**
 * Handles a global select none event.
 * @private
 */
calendarmailer.picker.ui.FilteringWidget.prototype.handleSelectNone_ =
    function() {
  this.dispatchEvent(
      calendarmailer.picker.ui.FilteringWidget.EventType.SELECT_NONE);
};


/**
 * Handles a global submit event.
 * @private
 */
calendarmailer.picker.ui.FilteringWidget.prototype.handleSubmit_ = function() {
  this.dispatchEvent(calendarmailer.picker.ui.FilteringWidget.EventType.SUBMIT);
};


/**
 * Sets the given section visible.
 * @param {calendarmailer.picker.ui.FilteringWidget.SectionName} section The
 *     section.
 */
calendarmailer.picker.ui.FilteringWidget.prototype.setSectionVisible = function(
    section) {
  var dom = this.getDomHelper();
  var names = calendarmailer.picker.ui.FilteringWidget.SectionName;
  goog.dom.classes.enable(dom.getElement(names.CALENDARS),
      'filter-section-hidden', !(section == names.CALENDARS));
  goog.dom.classes.enable(dom.getElement(names.EVENTS),
      'filter-section-hidden', !(section == names.EVENTS));
  goog.dom.classes.enable(dom.getElement(names.SELECT),
      'filter-section-hidden', !(section == names.EVENTS));
};



/**
 * Filter widget event.
 * @param {string} type The event type.
 * @param {string=} opt_strFilter Optional string for filtering by name.
 * @param {boolean=} opt_filterRepeats Optionally indicate whether events should
 *     be filtered by whether they are repeating.
 * @constructor
 * @extends {goog.events.Event}
 */
calendarmailer.picker.ui.FilteringWidget.Event = function(type, opt_strFilter,
    opt_filterRepeats) {
  goog.base(this, type);

  this.filterStr = opt_strFilter || '';

  this.filterByRepeats = !!opt_filterRepeats;
};
goog.inherits(calendarmailer.picker.ui.FilteringWidget.Event,
    goog.events.Event);
