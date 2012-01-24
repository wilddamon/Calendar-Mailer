#!/usr/bin/env python
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

import datetime
import logging

import gdata.calendar
import gdata.calendar.service as gCalService
import atom
import gdata.service
import gdata.auth as gAuth
import gdata.alt.appengine as gEngine

import scripts.recurrenceanalyzer as recurs

class Calendar():
  google_string = 'google.com'

  def __init__(self, host_name):
    self.host_name = host_name
    # Stores the token_scope information
    self.token_scope = None
    # The one time use token value from the URL after the AuthSub redirect.
    self.token = None

    # Creates a Google Calendar client to talk to the Google Calendar service.
    self.calendar_client = gCalService.CalendarService()
    gEngine.run_on_appengine(self.calendar_client)

  def SetToken(self, token):
    self.token = token

  def SetCurrentUser(self, user):
    self.current_user = user

  def ManageAuth(self):
    if self.token:
      self.calendar_client.SetAuthSubToken(self.token)
      self.calendar_client.UpgradeToSessionToken()
      if self.current_user:
        return True
    return False

  def GetAuthSubToken(self):
    return self.calendar_client.GetAuthSubToken()

  def GetAuthSubUrl(self):
    return self.calendar_client.GenerateAuthSubURL(
          'http://%s/' % (self.host_name),
          '%s' %  'http://www.google.com/calendar/feeds',
          secure=False, session=True)

  def GetCalendars(self):
    calendar_feed = self.calendar_client.GetCalendarListFeed()
    calendars_dict = {}
    for calendar in calendar_feed.entry:
      calendars_dict[calendar.GetAlternateLink().href] = '%s (%s)' % (
          calendar.title.text,
              calendar.author[0].name.text or calendar.author[0].email)
    return calendars_dict

  def GetEvents(self, calendar, start_date, finish_date):
    event_feed = self.calendar_client.GetCalendarEventFeed(calendar)
    events_dict = {}
    for event in event_feed.entry:
      recurrence = event.recurrence
      if recurrence:
        if recurs.timeInEventRange(recurrence.text,
            start_date) or recurs.timeInEventRange(recurrence.text, finish_date):
          logging.info(event.title.text)
          events_dict[event.GetAlternateLink().href] = event.title.text
    logging.info(events_dict)
    return events_dict
