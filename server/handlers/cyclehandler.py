
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
      
    user_event_map = util.getEmailToEventObject(cycle)
    
    arr = []
    for username in user_event_map:
      user = {}
      user["name"] = username
      user["num_events"] = len(user_event_map[username])
      user["events"] = user_event_map[username]
      arr.append(user)
      
    logging.info(arr)

    self.response.out.write(json.dumps(arr))