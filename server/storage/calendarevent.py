
from google.appengine.ext import db

class CalendarEvent(db.Model):
  owner = db.EmailProperty(required = True)
  calendar_id = db.StringProperty(required = True, indexed = False)
  event_id = db.StringProperty(required = True, indexed = False)
  state = db.StringProperty(required = True,
      choices = set(["Pending", "Mailed", "Nag", "Followup", "Completed"]),
      indexed = False)