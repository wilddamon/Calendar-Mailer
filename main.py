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

from google.appengine.ext import webapp
from google.appengine.ext.webapp import util

from scripts.selectcalendarhandler import SelectCalendarHandler
from scripts.selecteventshandler import SelectEventsHandler

APP_NAME = 'Calendar event emailer'
HOST_NAME = 'calendarmailer.appspot.com'
#HOST_NAME = 'localhost:8084'

class MainHandler(SelectCalendarHandler):
  def __init__(self):
    SelectCalendarHandler.__init__(self, APP_NAME, HOST_NAME)

class MainSelectEventsHandler(SelectEventsHandler):
  def __init__(self):
    SelectEventsHandler.__init__(self, APP_NAME, HOST_NAME)

def main():
    application = webapp.WSGIApplication([
        ('/', MainHandler),
        ('/events', MainSelectEventsHandler)],
       debug=True)
    util.run_wsgi_app(application)


if __name__ == '__main__':
    main()
