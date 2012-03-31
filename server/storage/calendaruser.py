
from google.appengine.ext import db

# Storage of a event notifications for a user.
class CalendarUser(db.Model):
  email = db.EmailProperty(required = True)
  cycleId = db.StringProperty(required = True)
  events = db.ListProperty(item_type = db.Key, indexed = False)
  state = db.StringProperty(required = True,
      choices = set(["Pending", "Mailed", "Nag", "Followup", "Completed"]),
      indexed = False)
