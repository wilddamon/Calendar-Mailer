
from server.storage.calendaruser import CalendarUser

from google.appengine.api import users
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template

class UserHandler(webapp.RequestHandler):
  def get(self):
    user = users.GetCurrentUser()
    if not user:
      url = users.create_login_url(self.request.uri)
      self.redirect(url)
      return

    userObj = CalendarUser.gql('WHERE user = :1', user).get()

    template_values = {
      "name": user.user_id(),
      "events": []
    }
    html = template.render('django/user.html', template_values)
    self.response.out.write(html)