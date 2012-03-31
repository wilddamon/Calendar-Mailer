
import logging
import json

from server.storage.calendaruser import CalendarUser

from google.appengine.api import users
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template

class SubmitEventsHandler(webapp.RequestHandler):
  def post(self):
    user = users.GetCurrentUser()

    jsonObj = json.loads(self.request.body)
    names = jsonObj["names"]
    events = jsonObj["events"]
    logging.info("names:\n" + str(names))