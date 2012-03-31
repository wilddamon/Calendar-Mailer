// This file was automatically generated from filteringwidget.soy.
// Please don't edit this file by hand.

goog.provide('calendarmailer.soy.filteringwidget');

goog.require('soy');
goog.require('soy.StringBuilder');


/**
 * @param {Object.<string, *>=} opt_data
 * @param {soy.StringBuilder=} opt_sb
 * @return {string}
 * @notypecheck
 */
calendarmailer.soy.filteringwidget.all = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div class="filter-base"><div id="filter-calendars" class="filter-section"><div class="filter-title">Filter calendars</div><textarea class="filter-textbox" rows="1"></textarea></div><div id="filter-events" class="filter-section"><div class="filter-title">Filter events</div><div id="repeatingfilter" name="repeatingfilter" class="goog-checkbox goog-checkbox-unchecked filter-checkbox"></div><label id="repeatingfilter-label" for="repeatingfilter" class="checkbox-label">Show repeating events only.</label></div><div id="filter-select-control" class="filter-section"><div class="filter-title">Event selection global control</div><button class="filter-selectall">Select all visible events</button><button class="filter-selectnone">Deselect all visible events</button><button class="filter-submit">Add owners of all selected events to be mailed.</button></div></div>');
  return opt_sb ? '' : output.toString();
};
