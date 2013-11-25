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
from server.handlers.cyclehandler import CycleHandler
from server.handlers.dashboardhandler import DashboardHandler
from server.handlers.deletecyclehandler import DeleteCycleHandler
from server.handlers.pickerhandler import PickerHandler
from server.handlers.submiteventshandler import SubmitEventsHandler
from server.handlers.userhandler import UserHandler
from server.handlers.updatecyclehandler import UpdateCycleHandler

from google.appengine.ext import webapp
from google.appengine.ext.webapp import util

def main():
  application = webapp.WSGIApplication([
      ('/', DashboardHandler),
      ('/submitevents', SubmitEventsHandler),
      ('/picker', PickerHandler),
      ('/cycle', CycleHandler),
      ('/updatecycle', UpdateCycleHandler),
      ('/deletecycle', DeleteCycleHandler)
    ], debug=True)
  util.run_wsgi_app(application)


if __name__ == '__main__':
    main()
