
/**
 * @fileoverview A renderer for a list of calendars.
 */

goog.provide('calendarmailer.ui.Picker');
goog.provide('calendarmailer.ui.Picker.Event');
goog.provide('calendarmailer.ui.Picker.EventType');

goog.require('calendarmailer.soy.picker');
goog.require('goog.dom.classes');
goog.require('goog.events.Event');
goog.require('goog.ui.Button');
goog.require('goog.ui.Checkbox');
goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.Control');
goog.require('soy');



/**
 * A ui object for a list of calendars.
 * @constructor
 * @extends {goog.ui.Control}
 */
calendarmailer.ui.Picker = function() {
  goog.base(this);

  /**
   * Checkboxes for each calendar in the list.
   * @type {!Array.<!goog.ui.Checkbox>}
   * @protected
   */
  this.checkboxes = [];

  /**
   * An array of the ids of the selected calendars.
   * @type {!Array.<string>}
   * @private
   */
  this.selectedItems_ = [];

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
goog.inherits(calendarmailer.ui.Picker, goog.ui.Control);


/**
 * The calendar list submit event type.
 * @enum {string}
 */
calendarmailer.ui.Picker.EventType = {
  SUBMIT: 's'
};


/**
 * The element for the select all button to decorate.
 * @type {!Element}
 * @protected
 */
calendarmailer.ui.Picker.prototype.selectAllEl;


/**
 * The element for the select none button to decorate.
 * @type {!Element}
 * @protected
 */
calendarmailer.ui.Picker.prototype.selectNoneEl;


/**
 * The element for the submit button to decorate.
 * @type {!Element}
 * @protected
 */
calendarmailer.ui.Picker.prototype.submitEl;


/** @override */
calendarmailer.ui.Picker.prototype.createDom = function() {
  var dom = this.getDomHelper();
  var items = this.getItems();

  var el = soy.renderAsElement(calendarmailer.soy.picker.all, {
    idprefix: this.getId(),
    items: items,
    title: this.getId()
  });
  this.setElementInternal(el);

  this.selectAllEl = dom.getElementByClass('picker-select-all', el);
  this.selectNoneEl = dom.getElementByClass('picker-select-none', el);
  this.submitEl = dom.getElementByClass('picker-submit', el);
};


/** @override */
calendarmailer.ui.Picker.prototype.enterDocument = function() {
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
};


/**
 * Adds an item to the picker. Subclasses should override this function.
 * @param {{id: string, summary: string}} item The item.
 */
calendarmailer.ui.Picker.prototype.addItem = function(item) {
  var dom = this.getDomHelper();

  var pickerBoxes = dom.getElementByClass('picker-boxes', this.getElement());
  var row = soy.renderAsElement(calendarmailer.soy.picker.row, {
    idprefix: this.getId(),
    item: item
  });
  pickerBoxes.appendChild(row);

  var checkbox = new goog.ui.Checkbox(undefined /* opt_checked */, dom);
  this.addChild(checkbox);
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
calendarmailer.ui.Picker.prototype.setSubmitCaption = function(caption) {
  this.submitButton_.setContent(caption);
};


/**
 * Handles clicks on the select all button.
 * @private
 */
calendarmailer.ui.Picker.prototype.handleSelectAll_ = function() {
  for (var i = 0; i < this.checkboxes.length; ++i) {
    this.checkboxes[i].setChecked(true);
  }
  goog.dom.classes.enable(this.getElement(), 'picker-selected',
      this.checkboxes.length > 0);
};


/**
 * Handles clicks on the select none button.
 * @private
 */
calendarmailer.ui.Picker.prototype.handleSelectNone_ = function() {
  for (var i = 0; i < this.checkboxes.length; ++i) {
    this.checkboxes[i].setChecked(false);
  }
  goog.dom.classes.enable(this.getElement(), 'picker-selected',
      false);
};


/**
 * Handles clicks on the submit button.
 * @private
 */
calendarmailer.ui.Picker.prototype.handleSubmit_ = function() {
  this.dispatchEvent(new calendarmailer.ui.Picker.Event(
      this.getSelectedItems()));
};


/**
 * Handles clicks on anything in the picker.
 * @private
 */
calendarmailer.ui.Picker.prototype.handleClick_ = function() {
  var selectedItems = this.getSelectedItems();
  goog.dom.classes.enable(this.getElement(), 'picker-selected',
      selectedItems.length > 0);
};


/**
 * Gets the selected items.
 * @return {!Array.<string>} The array of item ids.
 */
calendarmailer.ui.Picker.prototype.getSelectedItems = function() {
  var ids = [];
  for (var i = 0; i < this.checkboxes.length; ++i) {
    if (this.checkboxes[i].isChecked()) {
      ids.push(this.checkboxes[i].getId());
    }
  }
  return ids;
};


/**
 * Gets the items object for the soy template. Subclasses should override this
 * method.
 * @return {!Array.<!Object>} An array of items; {id: string, summary: string}.
 * @protected
 */
calendarmailer.ui.Picker.prototype.getItems = goog.abstractMethod;


/** @override */
calendarmailer.ui.Picker.prototype.setEnabled = function(enabled) {
  for (var i = 0; i < this.checkboxes.length; ++i) {
    this.checkboxes[i].setEnabled(enabled);
  }

  this.selectAllButton_.setEnabled(enabled);
  this.selectNoneButton_.setEnabled(enabled);
  this.submitButton_.setEnabled(enabled);

  goog.base(this, 'setEnabled', enabled);
};


/**
 * Sets the visibility of the given checkbox.
 * @param {!goog.ui.Checkbox} box The checkbox.
 * @param {boolean} show Whether to show the box.
 * @protected
 */
calendarmailer.ui.Picker.prototype.showBox = function(box, show) {
    box.setVisible(show);
    var label = this.getDomHelper().getElement(
        this.getId() + '-' + box.getId() + '-label');
    goog.dom.classes.enable(label, 'picker-label-disabled', !show);

    if (!show && box.isChecked()) {
      box.setChecked(false);
      // Sets the background colour.
      this.handleClick_(); // TODO: rename
    }
};



/**
 * The event type which carries information on submit.
 * @param {!Array.<string>} items The item ids.
 * @constructor
 * @extends {goog.events.Event}
 */
calendarmailer.ui.Picker.Event = function(items) {
  goog.base(this, calendarmailer.ui.Picker.EventType.SUBMIT);

  /**
   * The ids of the items which were picked.
   * @type {!Array.<string>}
   */
  this.items = items;
};
goog.inherits(calendarmailer.ui.Picker.Event, goog.events.Event);

