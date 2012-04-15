
import json
import logging

from server.handlers.eventutil import util
from server.storage.cycle import Cycle

from google.appengine.api import users
from google.appengine.ext import db
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template

class CycleHandler(webapp.RequestHandler):
  def post(self):
    user = users.GetCurrentUser()

    cycle_id = self.request.get("id")

    cycle = db.get(db.Key.from_path(Cycle.kind(), cycle_id))
    if (not cycle):
      self.response.set_status(404, 'Cycle with id ' + cycle_id + ' not found.')
      return

    page_token = self.request.get("page")
    if (not page_token):
      page_token = 0
    user_event_map_result = util.getEmailToEventObject(cycle, int(page_token))
    user_event_map = user_event_map_result["events"]
    
    response = {
        "events": user_event_map, 
        "more_to_come": user_event_map_result["more_to_come"],
        "next_page": user_event_map_result["next_page"]
      }

    self.response.out.write(json.dumps(response))