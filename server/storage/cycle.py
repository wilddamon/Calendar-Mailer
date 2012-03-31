
from google.appengine.ext import db

class Cycle(db.Model):
  id = db.StringProperty(required = True)
  initiator = db.UserProperty(required = True)
  notifiedUsers = db.ListProperty(item_type = db.Key, indexed = False)
  date = db.DateTimeProperty(auto_now_add = True, indexed = False)