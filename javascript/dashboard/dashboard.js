
/**
 * @fileoverview The dashboard app for the calendar mailer.
 */
goog.provide('calendarmailer.dashboard.App');

goog.require('calendarmailer.CalendarApi');
goog.require('calendarmailer.Config');
goog.require('calendarmailer.RRuleFormatter');
goog.require('calendarmailer.RfcDateFormatter');
goog.require('calendarmailer.soy.userlist');
goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventType');
goog.require('goog.fs');
goog.require('goog.fs.DirectoryEntry');
goog.require('goog.fs.FileSaver');
goog.require('goog.i18n.DateTimeFormat');
goog.require('goog.json');
goog.require('goog.net.XhrIo');
goog.require('goog.object');
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
   * The calendar api wrapper.
   * @type {!calandermailer.CalendarApi}
   * @private
   */
  this.calendar_ = new calendarmailer.CalendarApi(new calendarmailer.Config());
  this.calendar_.startLoad();

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

  /**
   * The back button.
   * @type {!goog.ui.Button}
   * @private
   */
  this.backButton_ = new goog.ui.Button(null /* content */);
  this.backButton_.decorate(document.getElementById(
      'individual-back-button'));

  /**
   * The add more events button.
   * @type {!goog.ui.Button}
   * @private
   */
  this.addEventsButton_ = new goog.ui.Button(null /* content */);
  this.addEventsButton_.decorate(document.getElementById(
      'individual-add-button'));

  /**
   * The export button.
   * @type {!goog.ui.Button}
   * @private
   */
  this.exportButton_ = new goog.ui.Button(null /* content */);
  this.exportButton_.decorate(document.getElementById(
      'export-csv'));

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

  this.eventHandler_.
      listen(this.backButton_, goog.ui.Component.EventType.ACTION,
          this.handleBackClick_).
      listen(this.addEventsButton_, goog.ui.Component.EventType.ACTION,
          this.handleAddClick_).
      listen(this.createCycleButton_,
          goog.ui.Component.EventType.ACTION, this.handleNewCycleClick_).
      listen(this.exportButton_, goog.ui.Component.EventType.ACTION,
          this.handleExport_);

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
 * The ID of the cycle currently rendered into the app.
 * @type {?string}
 * @private
 */
calendarmailer.dashboard.App.prototype.currentCycle_ = null;


/**
 * Handles clicks on the cycles.
 * @param {!goog.events.BrowserEvent} e The event.
 * @private
 */
calendarmailer.dashboard.App.prototype.handleCycleClick_ = function(e) {
  if (e.target.id != this.currentCycle_) {
    this.currentCycle_ = e.target.id;
    this.userToEventArray_ = {};
    // Start sending a request to the server to get the cycle contents.
    goog.net.XhrIo.send(
        window.location.origin + '/cycle?id=' + this.currentCycle_,
        goog.bind(this.handleGetCycleResult_, this), 'POST');

    // Clear out the contents of the individual cycle area, and replace with a
    // spinner.
    var content = document.getElementById('individual-cycle-content');
    goog.soy.renderElement(content, calendarmailer.soy.userlist.all,
        {'users': []});

    var spinner = document.getElementById('spinner');
    goog.style.setStyle(spinner, 'display', '');
  }

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
 * Handles a click on the add events button.
 * @private
 */
calendarmailer.dashboard.App.prototype.handleAddClick_ = function() {
  window.location = window.location.origin + '/picker?id=' + this.currentCycle_;
};


/**
 * Handles a click on the new cycle button.
 * @private
 */
calendarmailer.dashboard.App.prototype.handleNewCycleClick_ = function() {
  window.location = window.location.origin + '/picker';
};


/**
 * Handles receiving a cycle from ther server.
 * @param {!goog.events.Event} e The result.
 * @private
 */
calendarmailer.dashboard.App.prototype.handleGetCycleResult_ =
    function(e) {
  var dateTimeFormatter = new goog.i18n.DateTimeFormat(
      goog.i18n.DateTimeFormat.Format.LONG_TIME);
  var json = goog.json.parse(e.target.getResponse());
  var userMap = json['events'];

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

  if (json['more_to_come']) {
    goog.net.XhrIo.send(
        window.location.origin + '/cycle?id=' + this.currentCycle_ +
            '&page=' + json['next_page'],
        goog.bind(this.handleGetCycleResult_, this), 'POST');
  } else {
    this.renderCycles_();
  }
};


/**
 * Renders the events currently stored in userToEventArray.
 * @private
 */
calendarmailer.dashboard.App.prototype.renderCycles_ = function() {
  var spinner = document.getElementById('spinner');
  goog.style.setStyle(spinner, 'display', 'none');

  var tableEl = document.getElementById('userlist-table').firstChild;
  goog.object.forEach(this.userToEventArray_, function(eventArray, email) {
    // Render the table rows.
    var rows = goog.soy.renderAsFragment(
        calendarmailer.soy.userlist.wrappedRow, {
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

  var keys = goog.object.getKeys(this.calendarIds_);
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
  if (!result.status) {
    var listEl = document.getElementById('userlist-calendarlist');
    listEl.appendChild(goog.soy.renderAsFragment(
        calendarmailer.soy.userlist.wrappedCalendarListRow, {
          'calendar': result,
          'numEvents': this.calendarIds_[result['id']]
        }).firstChild.firstChild);
  }
  var keys = goog.object.getKeys(this.calendarIds_);
  if (++index < keys.length) {
    this.calendar_.getCalendarSummary(keys[index],
        goog.bind(this.handleCalendarResult_, this));
  }
};


/**
 * Handles a click on the export button.
 * @private
 */
calendarmailer.dashboard.App.prototype.handleExport_ = function() {
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


/**
 * Handles the file writer becoming ready.
 * @param {string} result The contents to write to the file.
 * @param {!goog.fs.FileEntry} file The file entry for the file.
 * @param {!goog.fs.FileWriter} writer The file writer.
 * @private
 */
calendarmailer.dashboard.App.prototype.
    handleWriterReady_ = function(result, file, writer) {
  var bb = window.BlobBuilder ? new BlobBuilder() : new WebKitBlobBuilder();
  bb.append(result);
  writer.truncate(1);
  this.eventHandler_.listenOnce(writer, goog.fs.FileSaver.EventType.WRITE_END,
      function() {
        writer.write(bb.getBlob('text/plain'));
        window.location.href = file.toUrl();
      }, this);
};


// Bootstrap functions.
function initApp() {
  var app = new calendarmailer.dashboard.App();
}


/**
 * Onload handler.
 */
window.onload = initApp;
