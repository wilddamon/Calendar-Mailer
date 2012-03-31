
from google.appengine.ext import db

# Storage of a event notifications for a user.
class CalendarUser(db.Model):
  user = db.UserProperty(required = True)
  cycleId = db.StringProperty(required = True)
  date = db.DateTimeProperty(auto_now_add = True, indexed=False)
  state = db.StringProperty(required = True,
      choices = set(["Pending", "Mailed", "Nag", "Followup", "Completed"]),
      indexed = False)
