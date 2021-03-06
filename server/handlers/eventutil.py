
import logging

from google.appengine.ext import db

class util:
  @staticmethod
  def getEmailToEventId(cycle):
    # Gets a map of email address : event object for the given cycle ID.
    user_event_map = {}
    if (cycle):
      fetched_events = db.query_descendants(cycle).run(batch_size=1000)
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
  def getEmailToEventObject(cycle, opt_pageOffset):
    if (opt_pageOffset):
      page_offset = opt_pageOffset
    else:
      page_offset = 0

    fetched_events = db.query_descendants(cycle).run(
        limit=50, offset=50*page_offset)

    user_event_map = {}
    events_processed = 0
    if (fetched_events):
      for event in fetched_events:
        email = event.owner
        if (not email in user_event_map):
          user_event_map[email] = []
        eventJson = {
          "id": event.event_id,
          "summary": event.summary,
          "state": event.state,
          "calendar_id": event.calendar_id,
          "location": event.event_location,
          "recurrence": event.recurrence,
          "startTime": event.start_time,
          "link": event.link
        }
        user_event_map[email].append(eventJson)
        events_processed += 1

    logging.info("user_event_map: " + str(user_event_map))
    return {
        "events": user_event_map, 
        "more_to_come": not events_processed < 50,
        "next_page": page_offset + 1
      }
