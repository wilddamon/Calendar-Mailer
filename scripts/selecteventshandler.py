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

from google.appengine.api import users
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template

from scripts.calendar import Calendar
from scripts.templatemanager import TemplateManager

class SelectEventsHandler(webapp.RequestHandler):
  def __init__(self, appname, hostname):
    self.calendar = Calendar(hostname)
    self.template_manager = TemplateManager(appname)

  def post(self):
    start_date_str = self.request.get('start_date').split('-')
    end_date_str = self.request.get('end_date').split('-')

    start_date = datetime.date(int(start_date_str[0]),
        int(start_date_str[1]), int(start_date_str[2]))
    end_date = datetime.date(int(end_date_str[0]),
        int(end_date_str[1]), int(end_date_str[2]))
    calendars = self.request.get_all('calendars')

    events = {}

    for calendar in calendars:
      logging.info('calendar: ' + calendar)
      events.update(self.calendar.GetEvents(calendar, start_date, end_date))
    logging.info(events)

    valuefile = self.template_manager.SelectEventsPage(
        users.CreateLogoutURL(self.request.uri), events)

    path = 'templates/%s' % valuefile[1]
    self.response.out.write(template.render(path, valuefile[0]))

