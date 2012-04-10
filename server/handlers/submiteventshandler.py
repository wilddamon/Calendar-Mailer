
import hashlib
import json
import logging
import os

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
    
    cycle = None
    user_event_map = {}
    # Get the cycle and any existing users in the cycle.
    if (cycle_id):
      logging.info("getting cycle with id: " + cycle_id)
      cycle = db.get(db.Key.from_path(Cycle.kind(), cycle_id))
      if (cycle):
        logging.info("got cycle: " + str(cycle))
        user_event_map = self.getEmailToEventId(cycle)
    if (not cycle):
      # Create the cycle db entry
      if (not cycle_id):
        os_rand = os.urandom(30)
        cycle_id = id = hashlib.sha1(user.nickname() + '-' + 
                   os_rand).hexdigest()
      
      cycle = Cycle(key_name = cycle_id, initiator = user)
      cycle.put()
      logging.info("Cycle with id \"" + cycle_id + "\" created by " +
          user.nickname())

    # Create the user db entries
    for event in events:
      #logging.info("event: " + str(event))
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
            state = "Pending")
        db_event.put()
        logging.info("created event: " + event["eventId"])

  # Gets a map of email address : event object for the given cycle ID.
  def getEmailToEventId(self, cycle):
    user_event_map = {}
    if (cycle):
      # TODO(wilddamon): Figure out how to get all the events!
      fetched_events = db.query_descendants(cycle).fetch(limit=10)
      logging.info("got events: " + str(fetched_events))
      if (fetched_events):
        for event in fetched_events:
          email = event.owner
          if (not email in user_event_map):
            user_event_map[email] = []
          user_event_map[email].append(event.event_id)
    logging.info("user_event_map: " + str(user_event_map))
    return user_event_map