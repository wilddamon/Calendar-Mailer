
import hashlib
import json
import logging
import os

from server.handlers.eventutil import util
from server.storage.calendarevent import CalendarEvent
from server.storage.cycle import Cycle

from google.appengine.api import users
from google.appengine.ext import db
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template

class SubmitEventsHandler(webapp.RequestHandler):
  def post(self):
    user = users.GetCurrentUser()

    jsonObj = json.loads(self.request.body)
    names = jsonObj["names"]
    events = jsonObj["events"]
    cycle_id = jsonObj["cycleId"]
    cycle_title = jsonObj["title"]

    cycle = None
    user_event_map = {}
    # Get the cycle and any existing users in the cycle.
    if (cycle_id):
      logging.info("getting cycle with id: " + cycle_id)
      cycle = db.get(db.Key.from_path(Cycle.kind(), cycle_id))
      if (cycle):
        logging.info("got cycle: " + str(cycle))
        user_event_map = util.getEmailToEventId(cycle)
    if (not cycle):
      # Create the cycle db entry
      if (not cycle_id):
        os_rand = os.urandom(30)
        cycle_id = id = hashlib.sha1(user.nickname() + '-' +
                   os_rand).hexdigest()

      cycle = Cycle(key_name = cycle_id, initiator = user, title = cycle_title)
      cycle.put()
      logging.info("Cycle with id \"" + cycle_id + "\" created by " +
          user.nickname())

    # Create the user db entries
    for event in events:
      logging.info("event: " + str(event))
      creator = event["owner"]
      if (not creator in names):
        logging.info("skipped due to creator being unselected: " + creator)
        continue
      if (not creator in user_event_map):
        user_event_map[creator] = []
      # Check to make sure we haven't already processed the event.
      if (not event["eventId"] in user_event_map[creator]):
        # Create a new event and put it in the map.
        user_event_map[creator].append(event)
        # Save the event for later.
        db_event = CalendarEvent(parent = cycle,
            owner = creator,
            calendar_id = event["calendarId"],
            event_id = event["eventId"],
            summary = event["summary"],
            event_location = event["location"],
            recurrence = event["recurrence"],
            start_time = event["startTime"],
            link = event["link"],
            state = "Pending")
        db_event.put()
        logging.info("created event: " + event["eventId"])
