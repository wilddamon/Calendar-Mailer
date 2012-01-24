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

class TemplateManager:
  def __init__(self, appname):
    self.appname = appname

  def LoginPage(self, loginurl):
    template_values = {
      'login_url': loginurl,
      'app_name': self.appname
      #'css_link': CSS_LINK,
      #'app_info': APP_INFO
      }
    template_file = 'login.html'
    return (template_values, template_file)

  def SelectCalendarsPage(self, logouturl, calendars, today, nextweek):
    template_values = {
      'logout_url': logouturl,
      'calendars': calendars,
      'app_name': self.appname,
      'todays_date': today.isoformat(),
      'end_date': nextweek.isoformat()
      }
    template_file = 'select_calendars.html'
    return (template_values, template_file)

  def SelectEventsPage(self, logouturl, events):
    template_values = {
      'logout_url': logouturl,
      'events': events,
      'app_name': self.appname
    }
    template_file = 'select_events.html'
    return (template_values, template_file)

  def AuthorizeAcessPage(self, authsuburl):
    template_values = {
      'authsub_url': authsuburl,
          'app_name': self.appname
      }
    template_file = 'authorize_access.html'
    return (template_values, template_file)
