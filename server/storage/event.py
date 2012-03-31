
from google.appengine.ext import db

class Event(db.Model):
  start = db.DateTimeProperty(required = True, indexed = False)
  end = db.DateTimeProperty(required = True, indexed = False)
  location = db.StringProperty(required = True, indexed = False)
  updated = db.DateTimeProperty(required = True, indexed = False)
  link = db.LinkProperty(required = True, indexed = False)
  summary = db.StringProperty(required = True, indexed = False)
  