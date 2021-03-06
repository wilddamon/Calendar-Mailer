
/**
 * @fileoverview A renderer for a list of calendars.
 */

goog.provide('calendarmailer.picker.ui.Picker');
goog.provide('calendarmailer.picker.ui.Picker.Event');
goog.provide('calendarmailer.picker.ui.Picker.EventType');

goog.require('calendarmailer.soy.picker');
goog.require('goog.dom.classes');
goog.require('goog.events.Event');
goog.require('goog.soy');
goog.require('goog.ui.Button');
goog.require('goog.ui.Checkbox');
goog.require('goog.ui.Component');
goog.require('goog.ui.Control');



/**
 * A ui object for a list of calendars.
 * @param {string=} opt_title The title for the picker.
 * @constructor
 * @extends {goog.ui.Control}
 */
calendarmailer.picker.ui.Picker = function(opt_title) {
  goog.base(this);

  /**
   * Checkboxes for each calendar in the list.
   * @type {!Array.<!goog.ui.Checkbox>}
   * @protected
   */
  this.checkboxes = [];

  /**
   * The title of the picker.
   * @type {string}
   * @private
   */
  this.title_ = opt_title || '';

  /**
   * The select all button.
   * @type {!goog.ui.Button}
   * @private
   */
  this.selectAllButton_ = new goog.ui.Button(null /* content */);
  this.addChild(this.selectAllButton_);

  /**
   * The select none button.
   * @type {!goog.ui.Button}
   * @private
   */
  this.selectNoneButton_ = new goog.ui.Button(null /* content */);
  this.addChild(this.selectNoneButton_);

  /**
   * The submit button
   * @type {!goog.ui.Button}
   * @private
   */
  this.submitButton_ = new goog.ui.Button(null /* content */);
  this.addChild(this.submitButton_);
};
goog.inherits(calendarmailer.picker.ui.Picker, goog.ui.Control);


/**
 * The calendar list submit event type.
 * @enum {string}
 */
calendarmailer.picker.ui.Picker.EventType = {
  SUBMIT: 's'
};


/**
 * The element for the select all button to decorate.
 * @type {!Element}
 * @protected
 */
calendarmailer.picker.ui.Picker.prototype.selectAllEl;


/**
 * The element for the select none button to decorate.
 * @type {!Element}
 * @protected
 */
calendarmailer.picker.ui.Picker.prototype.selectNoneEl;


/**
 * The element for the submit button to decorate.
 * @type {!Element}
 * @protected
 */
calendarmailer.picker.ui.Picker.prototype.submitEl;


/** @override */
calendarmailer.picker.ui.Picker.prototype.createDom = function() {
  var dom = this.getDomHelper();
  var items = this.getItems();

  var el = goog.soy.renderAsElement(calendarmailer.soy.picker.all, {
    idprefix: this.getId(),
    items: items,
    title: this.title_
  });
  this.setElementInternal(el);

  this.selectAllEl = dom.getElementByClass('picker-select-all', el);
  this.selectNoneEl = dom.getElementByClass('picker-select-none', el);
  this.submitEl = dom.getElementByClass('picker-submit', el);
};


/** @override */
calendarmailer.picker.ui.Picker.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  var dom = this.getDomHelper();
  var handler = this.getHandler();
  var items = this.getItems();

  for (var i = 0; i < items.length; ++i) {
    if (items[i].status && items[i].status.cancelled) {
      continue;
    }
    var checkbox = new goog.ui.Checkbox(undefined /* opt_checked */, dom);
    checkbox.setLabel(dom.getElement(
        this.getId() + '-' + items[i].id + '-label'));
    this.addChild(checkbox);
    this.checkboxes.push(checkbox);
    checkbox.decorate(dom.getElement(this.getId() + '-' + items[i].id));
    checkbox.setId(items[i].id);
    handler.listen(checkbox, goog.ui.Component.EventType.CHANGE,
        this.handleClick_);
  }

  this.selectAllButton_.decorate(this.selectAllEl);
  this.selectNoneButton_.decorate(this.selectNoneEl);
  this.submitButton_.decorate(this.submitEl);

  handler.
      listen(this.selectAllButton_, goog.ui.Component.EventType.ACTION,
          this.handleSelectAll_).
      listen(this.selectNoneButton_, goog.ui.Component.EventType.ACTION,
          this.handleSelectNone_).
      listen(this.submitButton_, goog.ui.Component.EventType.ACTION,
          this.handleSubmit_);

  this.getRenderer().setFocusable(this, false);
};


/**
 * Gets the title of the picker.
 * @return {string} The title.
 */
calendarmailer.picker.ui.Picker.prototype.getTitle = function() {
  return this.title_;
};


/**
 * Adds an item to the picker. Subclasses should override this function.
 * @param {{id: string, summary: string}} item The item.
 * @param {boolean=} opt_checked Whether the item should start out checked.
 */
calendarmailer.picker.ui.Picker.prototype.addItem = function(item, 
    opt_checked) {
  var dom = this.getDomHelper();

  var pickerBoxes = dom.getElementByClass('picker-boxes', this.getElement());
  var row = goog.soy.renderAsElement(calendarmailer.soy.picker.row, {
    idprefix: this.getId(),
    item: item
  });
  pickerBoxes.appendChild(row);

  var checkbox = new goog.ui.Checkbox(opt_checked, dom);
  this.addChild(checkbox);
  this.checkboxes.push(checkbox);
  checkbox.setLabel(dom.getElement(
      this.getId() + '-' + item.id + '-label'));
  checkbox.decorate(row.firstChild);

  checkbox.setId(item.id);
  this.getHandler().listen(checkbox, goog.ui.Component.EventType.CHANGE,
      this.handleClick_);
};


/**
 * Sets the caption on the submit button. Only works after rendering.
 * @param {string} caption The caption.
 */
calendarmailer.picker.ui.Picker.prototype.setSubmitCaption = function(caption) {
  this.submitButton_.setContent(caption);
};


/**
 * Handles clicks on the select all button.
 * @private
 */
calendarmailer.picker.ui.Picker.prototype.handleSelectAll_ = function() {
  this.selectAll(true);
};


/**
 * Handles clicks on the select none button.
 * @private
 */
calendarmailer.picker.ui.Picker.prototype.handleSelectNone_ = function() {
  this.selectAll(false);
};


/**
 * Handles clicks on the submit button.
 * @private
 */
calendarmailer.picker.ui.Picker.prototype.handleSubmit_ = function() {
  this.dispatchEvent(new calendarmailer.picker.ui.Picker.Event(
      this.getSelectedItems()));
};


/**
 * Handles clicks on anything in the picker.
 * @private
 */
calendarmailer.picker.ui.Picker.prototype.handleClick_ = function() {
  var selectedItems = this.getSelectedItems();
  goog.dom.classes.enable(this.getElement(), 'picker-selected',
      selectedItems.length > 0);
};


/**
 * Gets the selected items.
 * @return {!Array.<!Object>} The array of item ids and titles.
 */
calendarmailer.picker.ui.Picker.prototype.getSelectedItems = function() {
  var idTitles = [];
  var items = this.getItems();
  for (var i = 0; i < this.checkboxes.length; ++i) {
    if (this.checkboxes[i].isChecked()) {
      idTitles.push({
        'id': this.checkboxes[i].getId(),
        'title': items[i].summary
      });
    }
  }
  return idTitles;
};


/**
 * Gets the items object for the soy template. Subclasses should override this
 * method.
 * @return {!Array.<!Object>} An array of items; {id: string, summary: string}.
 * @protected
 */
calendarmailer.picker.ui.Picker.prototype.getItems = goog.abstractMethod;


/**
 * Programatically sets all checkboxes to the given state.
 * @param {boolean} select The new state for all the checkboxes.
 */
calendarmailer.picker.ui.Picker.prototype.selectAll = function(select) {
  for (var i = 0; i < this.checkboxes.length; ++i) {
    var box = this.checkboxes[i];
    box.setChecked(select && box.isVisible());
  }
  goog.dom.classes.enable(this.getElement(), 'picker-selected',
      select ? this.checkboxes.length > 0 : false);
};


/** @override */
calendarmailer.picker.ui.Picker.prototype.setEnabled = function(enabled) {
  if (enabled) {
    goog.base(this, 'setEnabled', enabled);
  }

  for (var i = 0; i < this.checkboxes.length; ++i) {
    this.checkboxes[i].setEnabled(enabled);
  }

  this.selectAllButton_.setEnabled(enabled);
  this.selectNoneButton_.setEnabled(enabled);
  this.submitButton_.setEnabled(enabled);

  if (!enabled) {
    goog.base(this, 'setEnabled', enabled);
  }
};


/**
 * Sets the visibility of the given checkbox.
 * @param {!goog.ui.Checkbox} box The checkbox.
 * @param {boolean} show Whether to show the box.
 * @protected
 */
calendarmailer.picker.ui.Picker.prototype.showBox = function(box, show) {
  box.setVisible(show);
  var label = this.getDomHelper().getElement(
      this.getId() + '-' + box.getId() + '-label').parentElement;
  goog.dom.classes.enable(label, 'picker-row-hidden', !show);

  if (!show && box.isChecked()) {
    box.setChecked(false);
    // Sets the background colour.
    this.handleClick_(); // TODO: rename
  }
};


/**
 * Sets the display of the title.
 * @param {boolean} show Whether to show the title.
 */
calendarmailer.picker.ui.Picker.prototype.showTitle = function(show) {
  var title = this.getDomHelper().getElementByClass('picker-title',
      this.getElement());
  if (title) {
    goog.dom.classes.enable(title, 'picker-title-hidden', !show);
  }
};



/**
 * The event type which carries information on submit.
 * @param {!Array.<!Object>} items The item ids.
 * @constructor
 * @extends {goog.events.Event}
 */
calendarmailer.picker.ui.Picker.Event = function(items) {
  goog.base(this, calendarmailer.picker.ui.Picker.EventType.SUBMIT);

  /**
   * The ids of the items which were picked.
   * @type {!Array.<!Object>}
   */
  this.items = items;
};
goog.inherits(calendarmailer.picker.ui.Picker.Event, goog.events.Event);

