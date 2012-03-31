
import hashlib
import json
import logging
import os

from server.storage.calendaruser import CalendarUser
from server.storage.cycle import Cycle

from google.appengine.api import users
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template

class SubmitEventsHandler(webapp.RequestHandler):
  def post(self):
    user = users.GetCurrentUser()

    jsonObj = json.loads(self.request.body)
    names = jsonObj["names"]
    events = jsonObj["events"]
    cycleId = jsonObj["cycleId"]
    logging.info("names:\n" + str(names))
    logging.info("events:\n" + str(events))

    # Create the user db entries
    #for event in events:
      #creator = event["creator"]["email"]
      #if (names.index(creator) < 0):
      #  continue
      # TODO(wilddamon): Populate the models for this user.
    
    if (not cycleId):
      # Create the cycle db entry
      os_rand = os.urandom(30)
      cycle_id = id = hashlib.sha1(user.nickname() + '-' + os_rand).hexdigest()
      
      cycle_db = Cycle(
        id = cycle_id,
        initiator = user)
      cycle_db.put()
      logging.info("Cycle with id \"" + cycle_id + "\" created.")
    else:
      # Adding more entries to an existing cycle TODO(wilddamon)
      pass
