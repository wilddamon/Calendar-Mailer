
/**
 * @fileoverview The dashboard app for the calendar mailer.
 */
goog.provide('calendarmailer.dashboard.App');

goog.require('calendarmailer.soy.spinner');
goog.require('calendarmailer.soy.userlist');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventType');
goog.require('goog.json');
goog.require('goog.net.XhrIo');
goog.require('goog.soy');
goog.require('goog.style');
goog.require('goog.ui.Button');
goog.require('goog.ui.Component');



/**
 * The main dashboard app container class.
 * @constructor
 */
calendarmailer.dashboard.App = function() {
  /**
   * The event handler.
   * @type {!goog.events.EventHandler}
   * @private
   */
  this.eventHandler_ = new goog.events.EventHandler(this);

  /**
   * The div in which the list of all the cycles are displayed.
   * @type {!Element}
   * @private
   */
  this.allCyclesEl_ = document.getElementById('all-cycles');

  /**
   * The div in which information about an individual cycle is displayed.
   * @type {!Element}
   * @private
   */
  this.oneCycleEl_ = document.getElementById('individual-cycle');

  /**
   * The create new cycle button.
   * @type {!goog.ui.Button}
   * @private
   */
  this.createCycleButton_ = new goog.ui.Button(null /* content */);
  this.createCycleButton_.decorate(document.getElementById('new-cycle-button'));
  this.eventHandler_.listen(this.createCycleButton_,
      goog.ui.Component.EventType.ACTION, this.handleNewCycleClick_);

  /**
   * The back button.
   * @type {!goog.ui.Button}
   * @private
   */
  this.backButton_ = new goog.ui.Button(null /* content */);
  this.backButton_.decorate(document.getElementById(
      'individual-back-button'));
  this.eventHandler_.listen(this.backButton_,
      goog.ui.Component.EventType.ACTION, this.handleBackClick_);

  var cyclenodes = document.getElementsByClassName('cycle');
  for (var i = 0; i < cyclenodes.length; ++i) {
    var cyclenode = cyclenodes[i];
    var id = cyclenode.id;
    if (id) {
      this.eventHandler_.listen(cyclenode, goog.events.EventType.CLICK,
          this.handleCycleClick_);
    } else {
      goog.style.addClass(cyclenode, 'cycle-noid');
    }
  }
};


/**
 * Handles clicks on the cycles.
 * @param {!goog.events.BrowserEvent} e The event.
 * @private
 */
calendarmailer.dashboard.App.prototype.handleCycleClick_ = function(e) {
  var id = e.target.id;

  // Start sending a request to the server to get the cycle contents.
  goog.net.XhrIo.send('http://localhost:8081/cycle?id=' + id,
      goog.bind(this.handleGetCycleResult_, this), 'POST');

  // Clear out the contents of the individual cycle area, and replace with a
  // spinner.
  var content = document.getElementById('individual-cycle-content');
  goog.soy.renderElement(content, calendarmailer.soy.spinner.spinner, {});

  goog.style.setStyle(this.allCyclesEl_, 'display', 'none');
  goog.style.setStyle(this.oneCycleEl_, 'display', '');

};


/**
 * Handles a click on the back button.
 * @private
 */
calendarmailer.dashboard.App.prototype.handleBackClick_ = function() {
  goog.style.setStyle(this.allCyclesEl_, 'display', '');
  goog.style.setStyle(this.oneCycleEl_, 'display', 'none');
};


/**
 * Handles a click on the new cycle button.
 * @private
 */
calendarmailer.dashboard.App.prototype.handleNewCycleClick_ = function() {
  window.location = 'http://localhost:8081/picker';
};


/**
 * Handles receiving a cycle from ther server.
 * @param {!goog.events.Event} e The result.
 * @private
 */
calendarmailer.dashboard.App.prototype.handleGetCycleResult_ =
    function(e) {
  var json = e.target.getResponse();
  var obj = goog.json.parse(json);
  window.console.log(obj);
  var content = document.getElementById('individual-cycle-content');
  goog.soy.renderElement(content, calendarmailer.soy.userlist.all,
      {'users': obj});
};


// Bootstrap functions.
function initApp() {
  var app = new calendarmailer.dashboard.App();
}


/**
 * Onload handler.
 */
window.onload = initApp;
