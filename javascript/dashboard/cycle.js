/**
 * @fileoverview The UI to display a single cycle.
 */
goog.provide('calendarmailer.dashboard.Cycle');

goog.require('calendarmailer.RRuleFormatter');
goog.require('calendarmailer.RfcDateFormatter');
goog.require('calendarmailer.soy.cycle');
goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.fs');
goog.require('goog.fs.DirectoryEntry');
goog.require('goog.i18n.DateTimeFormat');
goog.require('goog.object');
goog.require('goog.soy');
goog.require('goog.style');
goog.require('goog.ui.Button');
goog.require('goog.ui.Component');



/**
 * Tht UI to display the contents of a single cycle.
 * @param {string} id The ID of the cycle.
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @extends {goog.ui.Component}
 * @constructor
 */
calendarmailer.dashboard.Cycle = function(id, opt_domHelper) {
  goog.base(this, opt_domHelper);

  this.setId(id);

  /** @private {!goog.ui.Button} */
  this.addEventsButton_ = new goog.ui.Button(null /* content */);
  this.addChild(this.addEventsButton_);

  /** @private {!goog.ui.Button} */
  this.exportButton_ = new goog.ui.Button(null /* content */);
  this.addChild(this.exportButton_);

  /**
   * A map of the ids of the calendars events were pulled from, along with the
   * number of events for that calendar.
   * @type {!Object.<number>}
   * @private
   */
  this.calendarIds_ = {};

  /**
   * A map of username to array of events.
   * @type {!Object.<!Array.<!Object>>}
   * @private
   */
  this.userToEventArray_ = {};

};
goog.inherits(calendarmailer.dashboard.Cycle, goog.ui.Component);


/** @override */
calendarmailer.dashboard.Cycle.prototype.createDom = function() {
  this.setElementInternal(
      goog.soy.renderAsElement(calendarmailer.soy.cycle.all, {}));

  goog.soy.renderElement(this.getElementByClass('individual-cycle-content'),
      calendarmailer.soy.cycle.userlist, {users: []});

  var tableEl = this.getElementByClass('userlist-table');
  goog.object.forEach(this.userToEventArray_, function(eventArray, email) {
    // Render the table rows.
    var rows = goog.soy.renderAsFragment(
        calendarmailer.soy.cycle.wrappedRow, {
          'user': {
            'name': email,
            'num_events': eventArray.length,
            'events': eventArray
          }
        }).firstChild.childNodes;
    goog.dom.append(tableEl, rows);
    // Store the calendar IDs.
    for (var i = 0; i < eventArray.length; ++i) {
      var calendarId = eventArray[i]['calendar_id'];
      if (!this.calendarIds_[calendarId]) {
        this.calendarIds_[calendarId] = 0;
      }
      this.calendarIds_[calendarId]++;
    }
  }, this);
};


/** @override */
calendarmailer.dashboard.Cycle.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.addEventsButton_.decorate(this.getElementByClass('add'));
  this.exportButton_.decorate(this.getElementByClass('export-csv'));

  this.getHandler().
      listen(this.addEventsButton_, goog.ui.Component.EventType.ACTION,
          this.handleAddClick_).
      listen(this.exportButton_, goog.ui.Component.EventType.ACTION,
          this.handleExport_);
};


/**
 * Adds data to be displayed.
 * @param {!Object} userMap A map of events, by user.
 */
calendarmailer.dashboard.Cycle.prototype.addEventData = function(userMap) {
  var dateTimeFormatter = new goog.i18n.DateTimeFormat(
      goog.i18n.DateTimeFormat.Format.LONG_TIME);

  goog.object.forEach(userMap, function(eventArray, email) {
    if (!this.userToEventArray_[email]) {
      this.userToEventArray_[email] = [];
    }
    for (var i = 0; i < eventArray.length; ++i) {
      // Make the start time and RRule pretty.
      var startTime = calendarmailer.RfcDateFormatter.getInstance().
          parse(eventArray[i].startTime);
      if (eventArray[i].startTime) {
        eventArray[i].startTime = dateTimeFormatter.format(startTime);
      }
      var rruleFormatter = calendarmailer.RRuleFormatter.getInstance();
      for (var j = 0; j < eventArray[i].recurrence.length; ++j) {
        var original = eventArray[i].recurrence[j];
        eventArray[i].recurrence[j] = rruleFormatter.prettyPrint(original);
      }
      goog.array.insert(this.userToEventArray_[email], eventArray[i]);
    }
  }, this);
};


/**
 * Adds calendar summary data.
 * @param {!Object} data
 */
calendarmailer.dashboard.Cycle.prototype.addCalendarData = function(data) {
  var listEl = this.getElementByClass('userlist-calendarlist');
  listEl.appendChild(goog.soy.renderAsFragment(
      calendarmailer.soy.cycle.wrappedCalendarListRow, {
        'calendar': data,
        'numEvents': this.calendarIds_[data['id']]
      }).firstChild.firstChild);
};


/**
 * @return {!Array.<string>}
 */
calendarmailer.dashboard.Cycle.prototype.getCalendarIds = function() {
  return goog.object.getKeys(this.calendarIds_);
};


/**
 * Handles a click on the export button.
 * @private
 */
calendarmailer.dashboard.Cycle.prototype.handleExport_ = function() {
  //this.userToEventArray_
  var resultArr = [];
  resultArr.push('email,TotalEvents,EventName,EventLink,EventLocation,' +
      'StartTime,EventRecurrence,UserAction');

  goog.object.forEach(this.userToEventArray_, function(eventArr, email) {
    var row = [];
    var length = eventArr.length;
    goog.array.forEach(eventArr, function(event) {
      row.push(email);
      row.push(length);
      row.push(event['summary']);
      row.push(event['link']);
      row.push(event['location']);
      row.push(event['startTime']);
      row.push(event['recurrence'].join(','));
      row.push(event['state']);
    }, this);
    resultArr.push('"' + row.join('","') + '"');
  }, this);

  var result = resultArr.join('\n');
  var fs = goog.fs.getTemporary(1024 * 1024);
  fs.addCallback(function(fs) {
    var fileEntry = fs.getRoot().getFile('calendarmailer-data.csv',
        goog.fs.DirectoryEntry.Behavior.CREATE);
    fileEntry.addCallback(function(file) {
      var fileWriter = file.createWriter();
      fileWriter.addCallback(
          goog.bind(this.handleWriterReady_, this, result, file));
    }, this);
    fileEntry.addErrback(function(er) {
      // TODO: Display this to the user.
      window.console.log(er);
    });
  }, this);
};


/** @param {boolean} visible */
calendarmailer.dashboard.Cycle.prototype.setVisible = function(visible) {
  goog.style.setStyle(this.getElement(), 'display', visible ? '' : 'none');
};
