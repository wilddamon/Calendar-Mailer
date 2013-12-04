/**
 * @fileoverview The dashboard app for the calendar mailer.
 */
goog.provide('calendarmailer.dashboard.App');

goog.require('calendarmailer.CalendarApi');
goog.require('calendarmailer.Config');
goog.require('calendarmailer.dashboard.Cycle');
goog.require('calendarmailer.dashboard.CyclePicker');
goog.require('goog.dom');
goog.require('goog.events.EventHandler');
goog.require('goog.json');
goog.require('goog.net.XhrIo');
goog.require('goog.style');
goog.require('goog.ui.Button');
goog.require('goog.ui.Component');



/**
 * The main dashboard app container class.
 * @constructor
 */
calendarmailer.dashboard.App = function() {
  /** @private {!goog.events.EventHandler} */
  this.eventHandler_ = new goog.events.EventHandler(this);

  /** @private {!calandermailer.CalendarApi} */
  this.calendar_ = new calendarmailer.CalendarApi(new calendarmailer.Config());
  this.calendar_.startLoad();

  /** @private {!calendarmailer.dashboard.CyclePicker} */
  this.cyclePicker_ = new calendarmailer.dashboard.CyclePicker();
  this.cyclePicker_.decorate(goog.dom.getElementByClass('cycles'));

  /**
   * A map of cycle ID to cycle displays.
   * @private {!Object.<calendarmailer.dashboard.Cycle}
   */
  this.cycleDisplays_ = {};

  /** @private {!goog.ui.Button} */
  this.backButton_ = new goog.ui.Button(null /* content */);
  this.backButton_.decorate(document.getElementById(
      'individual-back-button'));

  this.eventHandler_.
      listen(this.cyclePicker_,
          calendarmailer.dashboard.CyclePicker.EventType.PICK,
          this.handleCycleClick_).
      listen(this.cyclePicker_,
          calendarmailer.dashboard.CyclePicker.EventType.DELETE,
          this.handleCycleDelete_).
      listen(this.backButton_, goog.ui.Component.EventType.ACTION,
          this.handleBackClick_);
};


/**
 * Handles clicks on the cycles.
 * @param {!goog.events.BrowserEvent} e The event.
 * @private
 */
calendarmailer.dashboard.App.prototype.handleCycleClick_ = function(e) {
  this.currentCycle_ = e.id;
  if (this.cycleDisplays_[this.currentCycle_]) {
    this.showCycleDisplay_(this.currentCycle_);
  } else {
    // Start sending a request to the server to get the cycle contents.
    goog.net.XhrIo.send(
        window.location.origin + '/cycle?id=' + this.currentCycle_,
        goog.bind(this.handleGetCycleResult_, this), 'POST');

    this.showSpinner_(true);
  }

  this.cyclePicker_.setVisible(false);
  this.backButton_.setVisible(true);
};


/**
 * @param {!calendarmailer.Event} e
 * @private
 */
calendarmailer.dashboard.App.prototype.handleCycleDelete_ = function(e) {
  goog.net.XhrIo.send(
      window.location.origin + '/deletecycle?id=' + e.id,
      goog.bind(this.handleDeleteCycleResult_, this, e.id), 'POST');

  this.showSpinner_(true);
};


/**
 * @param {!calendarmailer.Event} e
 * @private
 */
calendarmailer.dashboard.App.prototype.handleEventDelete_ = function(e) {
  goog.net.XhrIo.send(
      window.location.origin + '/deleteevent?event_id=' + e.id +
      '&cycle_id=' + this.currentCycle_,
      goog.nullFunction, 'POST');
};


/**
 * Handles a click on the back button.
 * @private
 */
calendarmailer.dashboard.App.prototype.handleBackClick_ = function() {
  this.showCycleDisplay_(null);
};


/**
 * Handles a click on the add events button.
 * @param {!goog.events.Event} e
 * @private
 */
calendarmailer.dashboard.App.prototype.handleAddClick_ = function(e) {
  window.location = window.location.origin + '/picker?id=' + e.target.getId() +
      '&title=' + e.target.getTitle();
};


/**
 * @param {boolean} show
 * @private
 */
calendarmailer.dashboard.App.prototype.showSpinner_ = function(show) {
  var spinner = document.getElementById('spinner');
  goog.style.setStyle(spinner, 'display', show ? '' : 'none');
};


/**
 * @param {?string} id
 * @private
 */
calendarmailer.dashboard.App.prototype.showCycleDisplay_ = function(id) {
  if (id && this.cycleDisplays_[id]) {
    this.cycleDisplays_[id].setVisible(true);
  } else {
    if (this.currentCycle_ && this.cycleDisplays_[this.currentCycle_]) {
      this.cycleDisplays_[this.currentCycle_].setVisible(false);
    }
  }
  this.cyclePicker_.setVisible(!id);
  this.backButton_.setVisible(!!id);
  goog.style.showElement(document.getElementById('all-cycles'), !id);
};


/**
 * @param {string} id
 * @private
 */
calendarmailer.dashboard.App.prototype.handleDeleteCycleResult_ = function(id) {
  this.cyclePicker_.removeCycle(id);
  this.showSpinner_(false);
};


/**
 * Handles receiving a cycle from ther server.
 * @param {!goog.events.Event} e The result.
 * @private
 */
calendarmailer.dashboard.App.prototype.handleGetCycleResult_ =
    function(e) {
  var response = e.target.getResponse();
  var json = [];
  if (response) {
    json = goog.json.parse(response);
  }
  var userMap = json['events'];
  var title = json['title'];

  if (!this.cycleDisplays_[this.currentCycle_]) {
    this.cycleDisplays_[this.currentCycle_] =
        new calendarmailer.dashboard.Cycle(this.currentCycle_, title);
    this.eventHandler_.
        listen(this.cycleDisplays_[this.currentCycle_],
            calendarmailer.dashboard.Cycle.EventType.ADD_MORE,
            this.handleAddClick_).
        listen(this.cycleDisplays_[this.currentCycle_],
            calendarmailer.dashboard.Cycle.EventType.TITLE_CHANGE,
            this.handleTitleChange_).
        listen(this.cycleDisplays_[this.currentCycle_],
            calendarmailer.dashboard.Cycle.EventType.DELETE_EVENT,
            this.handleEventDelete_);
  }
  this.cycleDisplays_[this.currentCycle_].addEventData(userMap);

  if (json['more_to_come']) {
    goog.net.XhrIo.send(
        window.location.origin + '/cycle?id=' + this.currentCycle_ +
            '&page=' + json['next_page'],
        goog.bind(this.handleGetCycleResult_, this), 'POST');
  } else {
    this.showSpinner_(false);
    this.renderIndividualCycle_();
  }
};


/**
 * Renders the events currently stored in userToEventArray.
 * @private
 */
calendarmailer.dashboard.App.prototype.renderIndividualCycle_ = function() {
  this.cycleDisplays_[this.currentCycle_].render(
      document.getElementById('individual-cycle-container'));
  this.showCycleDisplay_(this.currentCycle_);

  var keys = this.cycleDisplays_[this.currentCycle_].getCalendarIds();
  // TODO: Don't use a global variable here.
  index = 0;
  if (this.calendar_.isInitialized()) {
    this.calendar_.getCalendarSummary(keys[0],
        goog.bind(this.handleCalendarResult_, this));
  } else {
    this.eventHandler_.listenOnce(this.calendar_,
        calendarmailer.CalendarApi.EventType.LOADED, function() {
          this.calendar_.getCalendarSummary(keys[0],
              goog.bind(this.handleCalendarResult_, this));
        });
  }
};


/**
 * Handles receiving a information about events from ther server.
 * @param {!Object} result The result.
 * @private
 */
calendarmailer.dashboard.App.prototype.handleCalendarResult_ = function(
    result) {
  if (!result.error) {
    this.cycleDisplays_[this.currentCycle_].addCalendarData(result);
  }
  var keys = this.cycleDisplays_[this.currentCycle_].getCalendarIds();
  if (++index < keys.length) {
    this.calendar_.getCalendarSummary(keys[index],
        goog.bind(this.handleCalendarResult_, this));
  }
};


/**
 * Handles the title of a cycle being changed by the user.
 * @private
 */
calendarmailer.dashboard.App.prototype.handleTitleChange_ = function() {
  var title = this.cycleDisplays_[this.currentCycle_].getTitle();
  goog.net.XhrIo.send(
      window.location.origin + '/updatecycle?id=' + this.currentCycle_ +
      '&title=' + title, goog.nullFunction,
      'POST');
  this.cyclePicker_.setCycleTitle(this.currentCycle_, title);
};


// Bootstrap functions.
function initApp() {
  var app = new calendarmailer.dashboard.App();
}


/**
 * Onload handler.
 */
window.onload = initApp;
