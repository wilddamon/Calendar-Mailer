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

import gdata.service as gService
import gdata.calendar.service as gCalService

from google.appengine.api import users
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template

from scripts.calendar import Calendar
from scripts.templatemanager import TemplateManager

class SelectCalendarHandler(webapp.RequestHandler):
  def __init__(self, appname, hostname):
    # Stores the page's current user
    self.current_user = None
    self.calendar = Calendar(hostname)
    self.template_manager = TemplateManager(appname)
    self.app_name = appname
    self.host_name = hostname

  def get(self):
    # Get the current user
    self.current_user = users.GetCurrentUser()

    if not self.current_user:
      valuefile = self.template_manager.LoginPage(
          users.CreateLoginURL(self.request.uri))
    else:
      self.calendar.SetToken(self.request.get('token'))
      self.calendar.SetCurrentUser(self.current_user)

      # Manage our Authentication for the user
      if self.calendar.ManageAuth():
        self.redirect('http://%s/' % self.host_name)

      if self.calendar.GetAuthSubToken() is not None:
        today = datetime.date.today()
        nextweek = today.replace(day=(today.day + 7))

        try:
          valuefile = self.template_manager.SelectCalendarsPage(
              users.CreateLogoutURL(self.request.uri), self.calendar.GetCalendars(),
              today, nextweek)
        except gService.RequestError, request_exception:
          request_error = request_exception[0]
          if request_error['status'] == 401 or request_error['status'] == 403:
            gdata.alt.appengine.save_auth_tokens({})
            valuefile = self.template_manager.AuthorizeAcessPage(
                self.calendar.GetAuthSubUrl())
          # If the request failure was not due to a bad auth token, reraise the
          # exception for handling elsewhere.
          else:
            raise

      else:
        valuefile = self.template_manager.AuthorizeAcessPage(
            self.calendar.GetAuthSubUrl())
    path = 'templates/%s' % valuefile[1]
    self.response.out.write(template.render(path, valuefile[0]))
