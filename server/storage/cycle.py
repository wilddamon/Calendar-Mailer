
from google.appengine.ext import db

class Cycle(db.Model):
  initiator = db.UserProperty(required = True)
  start_date = db.DateTimeProperty(auto_now_add = True, indexed = False)
  last_updated = db.DateTimeProperty(auto_now_add = True, indexed = False)