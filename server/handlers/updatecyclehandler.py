
from google.appengine.api import users
from google.appengine.ext import db
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template

from server.storage.cycle import Cycle


class UpdateCycleHandler(webapp.RequestHandler):
  def post(self):
    user = users.GetCurrentUser()
    # TODO: Validate cycle owned by or shared with current user.

    cycle_id = self.request.get("id")
    cycle = db.get(db.Key.from_path(Cycle.kind(), cycle_id))
    if not cycle:
      self.response.set_status(404, 'Cycle with id ' + cycle_id + ' not found.')

    cycle.title = self.request.get("title")
    cycle.put()

