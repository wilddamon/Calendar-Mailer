
from google.appengine.ext import db

class Cycle(db.Model):
  initiator = db.UserProperty(required = True)
  notifiedUsers = db.StringListProperty(indexed = False)
  date = db.DateTimeProperty(auto_now_add = True, indexed = False)