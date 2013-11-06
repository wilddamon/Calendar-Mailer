/**
 * @fileoverview The UI to display a single cycle.
 */
goog.provide('calendarmailer.dashboard.Cycle');

goog.require('calendarmailer.RRuleFormatter');
goog.require('calendarmailer.RfcDateFormatter');
goog.require('calendarmailer.soy.cycle');
goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.fs');
goog.require('goog.fs.DirectoryEntry');
goog.require('goog.fs.FileSaver');
goog.require('goog.i18n.DateTimeFormat');
goog.require('goog.object');
goog.require('goog.soy');
goog.require('goog.style');
goog.require('goog.ui.Button');
goog.require('goog.ui.Component');
goog.require('goog.ui.LabelInput');



/**
 * Tht UI to display the contents of a single cycle.
 * @param {string} id The ID of the cycle.
 * @param {string=} opt_title The title of the cycle.
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @extends {goog.ui.Component}
 * @constructor
 */
calendarmailer.dashboard.Cycle = function(id, opt_title, opt_domHelper) {
  goog.base(this, opt_domHelper);

  this.setId(id);

  /** @private {string} */
  this.title_ = opt_title || '';

  /** @private {!goog.ui.LabelInput} */
  this.titleInput_ = new goog.ui.LabelInput(this.title_);
  this.addChild(this.titleInput_);
  this.titleInput_.setLabel('Untitled cycle');

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


/** @enum {string} */
calendarmailer.dashboard.Cycle.EventType = {
  ADD_MORE: goog.events.getUniqueId('a'),
  TITLE_CHANGE: goog.events.getUniqueId('tc')
};


/** @private {number} */
calendarmailer.dashboard.Cycle.prototype.totalNumEvents_ = 0;


/** @override */
calendarmailer.dashboard.Cycle.prototype.createDom = function() {
  this.setElementInternal(
      goog.soy.renderAsElement(calendarmailer.soy.cycle.all, {}));

  goog.soy.renderElement(this.getElementByClass('individual-cycle-content'),
      calendarmailer.soy.cycle.userlist, {users: []});

  var tableEl = this.getElementByClass('userlist-table');
  goog.object.forEach(this.userToEventArray_, function(eventArray, email) {
    this.totalNumEvents_ += eventArray.length;
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

  var listEl = this.getElementByClass('userlist-calendarlist');
  listEl.appendChild(goog.soy.renderAsFragment(
      calendarmailer.soy.cycle.wrappedCalendarListRow, {
        'calendar': {'summary': 'Total'},
        'numEvents': this.totalNumEvents_
      }).firstChild.firstChild);
};


/** @override */
calendarmailer.dashboard.Cycle.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.titleInput_.decorate(this.getElementByClass('individual-title'));
  this.titleInput_.setValue(this.title_);

  this.addEventsButton_.decorate(this.getElementByClass('add'));
  this.exportButton_.decorate(this.getElementByClass('export-csv'));

  this.getHandler().
      listen(this.titleInput_.getElement(), goog.events.EventType.CHANGE,
          this.handleTitleChange_).
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


/** @private */
calendarmailer.dashboard.Cycle.prototype.handleTitleChange_ = function() {
  this.title_ = this.titleInput_.getValue();
  this.dispatchEvent(calendarmailer.dashboard.Cycle.EventType.TITLE_CHANGE);
};


/** @private */
calendarmailer.dashboard.Cycle.prototype.handleAddClick_ = function() {
  this.dispatchEvent(calendarmailer.dashboard.Cycle.EventType.ADD_MORE);
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


/**
 * Handles the file writer becoming ready.
 * @param {string} result The contents to write to the file.
 * @param {!goog.fs.FileEntry} file The file entry for the file.
 * @param {!goog.fs.FileWriter} writer The file writer.
 * @private
 */
calendarmailer.dashboard.Cycle.prototype.handleWriterReady_ = function(result,
    file, writer) {
  var blob = new Blob([result], {type: 'text/plain'});
  writer.truncate(1);
  this.getHandler().listenOnce(writer, goog.fs.FileSaver.EventType.WRITE_END,
      function() {
        writer.write(blob);
        var link = document.createElement('a');
        link.href = file.toUrl();
        link.download = this.title_.replace(/ /g, '_') + '.csv';
        link.click();
      }, this);
};


/** @return {string} */
calendarmailer.dashboard.Cycle.prototype.getTitle = function() {
  return this.title_;
};


/** @param {string} title */
calendarmailer.dashboard.Cycle.prototype.setTitle = function(title) {
  this.title_ = title;
  if (this.isInDocument()) {
    this.titleInput_.setValue(title);
  }
};


/** @param {boolean} visible */
calendarmailer.dashboard.Cycle.prototype.setVisible = function(visible) {
  goog.style.setStyle(this.getElement(), 'display', visible ? '' : 'none');
};
