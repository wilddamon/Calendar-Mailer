
import logging

from google.appengine.ext import db

class util:
  @staticmethod
  def getEmailToEventId(cycle):
    # Gets a map of email address : event object for the given cycle ID.
    user_event_map = {}
    if (cycle):
      # TODO(wilddamon): Figure out how to get all the events!
      fetched_events = db.query_descendants(cycle).fetch(limit=1000)
      logging.info("got events: " + str(fetched_events))
      if (fetched_events):
        for event in fetched_events:
          email = event.owner
          if (not email in user_event_map):
            user_event_map[email] = []
          user_event_map[email].append(event.event_id)
    logging.info("user_event_map: " + str(user_event_map))
    return user_event_map

  @staticmethod
  def getEmailToEventObject(cycle):
    user_event_map = {}
    if (cycle):
      # TODO(wilddamon): Figure out how to get all the events!
      fetched_events = db.query_descendants(cycle).fetch(limit=1000)
      logging.info("got events: " + str(fetched_events))
      if (fetched_events):
        for event in fetched_events:
          email = event.owner
          if (not email in user_event_map):
            user_event_map[email] = []
          eventJson = {}
          eventJson["summary"] = event.summary
          eventJson["state"] = event.state
          user_event_map[email].append(eventJson)
    logging.info("user_event_map: " + str(user_event_map))
    return user_event_map