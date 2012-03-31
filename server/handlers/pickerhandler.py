
from google.appengine.api import users
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template

class PickerHandler(webapp.RequestHandler):
  def get(self):
    user = users.GetCurrentUser()
    if not user:
      url = users.create_login_url(self.request.uri)
      self.redirect(url)
      return

    template_values = {}
    html = template.render('django/picker.html', template_values)
    self.response.out.write(html)