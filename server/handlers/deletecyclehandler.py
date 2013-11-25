
import logging

from server.storage.calendarevent import CalendarEvent
from server.storage.cycle import Cycle

from google.appengine.api import users
from google.appengine.ext import db
from google.appengine.ext import webapp


class DeleteCycleHandler(webapp.RequestHandler):
  def post(self):
    user = users.GetCurrentUser()

    cycle_id = self.request.get('id')
    cycle = db.get(db.Key.from_path(Cycle.kind(), cycle_id))
    if not cycle:
      self.response.set_status(404, 'Cycle with id ' + cycle_id + ' not found.')
      return

    events_query = CalendarEvent.all(keys_only=True)
    events_query.ancestor(cycle)
    db.delete(events_query.run())
    db.delete(cycle)
    logging.info('Deleted cycle with id ' + cycle_id)
