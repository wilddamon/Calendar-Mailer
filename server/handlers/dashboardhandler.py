
import logging

from server.storage.cycle import Cycle

from google.appengine.api import users
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template

class DashboardHandler(webapp.RequestHandler):
  def get(self):
    user = users.GetCurrentUser()
    if not user:
      url = users.create_login_url(self.request.uri)
      self.redirect(url)
      return

    # TODO(wilddamon): Get all the cycles, or at least show a "get more" button.
    fetched_cycles = Cycle.gql('WHERE initiator = :1', user).fetch(limit=10)
    cycles = []
    if (fetched_cycles):
      for cycle in fetched_cycles:
        cycle.cycle_id = cycle.key().name()
        cycles.append(cycle)

    logging.info("Got cycles: " + str(cycles))

    template_values = {
      "name": user.user_id(),
      "cycles": cycles
    }
    html = template.render('django/dashboard.html', template_values)
    self.response.out.write(html)