
import logging

from server.storage.calendarevent import CalendarEvent
from server.storage.cycle import Cycle

from google.appengine.api import users
from google.appengine.ext import db
from google.appengine.ext import webapp


class DeleteEventHandler(webapp.RequestHandler):
  def post(self):
    user = users.GetCurrentUser()
    # TODO: Validate user is owner of the cycle containing the event.

    event_id = self.request.get('event_id')
    cycle_id = self.request.get('cycle_id')
    event = None

    if event_id and cycle_id:
      cycle_key = db.Key.from_path(Cycle.kind(), cycle_id)
      event = CalendarEvent.gql(
          'WHERE event_id = :1 AND ANCESTOR IS :2',
          event_id, cycle_key).get()

    if event is not None:
      event.delete()
      logging.info('Deleted event with id ' + event_id)
    else:
      self.response.set_status(404, 'Event with id %s not found in '
                               'cycle with id %s' % (event_id, cycle_id))

