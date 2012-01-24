#!/usr/bin/env python
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

import datetime
import logging
import string


# Analyses calendar recurrence event strings
#
# DTSTART;TZID=Australia/Sydney:20120125T100000
# DTEND;TZID=Australia/Sydney:20120125T110000
# RRULE:FREQ=WEEKLY;COUNT=35;BYDAY=WE
# BEGIN:VTIMEZONE
# TZID:Australia/Sydney
# X-LIC-LOCATION:Australia/Sydney
# BEGIN:STANDARD
# TZOFFSETFROM:+1100
# TZOFFSETTO:+1000
# TZNAME:EST
# DTSTART:19700405T030000
# RRULE:FREQ=YEARLY;BYMONTH=4;BYDAY=1SU
# END:STANDARD
# BEGIN:DAYLIGHT
# TZOFFSETFROM:+1000
# TZOFFSETTO:+1100
# TZNAME:EST
# DTSTART:19701004T020000
# RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=1SU
# END:DAYLIGHT
# END:VTIMEZONE
#
def getStartTime(recurrenceStr):
  recurrenceArr = recurrenceStr.split('\n')
  # Split into timezone and date strings
  parts = recurrenceArr[0].split(':')
  tzid = parts[0][len('DTSTART:TZID='):] # TODO(meade): Do something with this.
  result = datetime.datetime.strptime(parts[1], '%Y%m%dT%H%M%S')
  return result

def getEndTime(recurrenceStr):
  recurrenceArr = recurrenceStr.split('\n')
  # Split into timezone and date strings
  parts = recurrenceArr[1].split(':')
  tzid = parts[0][len('DTEND:TZID='):] # TODO(meade): Do something with this.
  result = datetime.datetime.strptime(parts[1], '%Y%m%dT%H%M%S')
  return result

def getRuleStr(recurrenceStr):
  recurrenceArr = recurrenceStr.split('\n')
  return recurrenceArr[2][len('RRULE:'):]

def getCount(recurrenceStr):
  ruleStr = getRuleStr(recurrenceStr)
  params = ruleStr.split(';')
  if string.find(params[1], 'COUNT=') >= 0:
    return int(params[1][len('COUNT='):])
  else:
    return -1

def getUntil(recurrenceStr):
  ruleStr = getRuleStr(recurrenceStr)
  params = ruleStr.split(';')
  if len(params) >= 3 and string.find(params[2], 'UNTIL=') >= 0:
    return datetime.datetime.strptime(params[2][len('UNTIL='):], '%Y%m%dT%H%M%SZ')
  else:
    return None

def timeInEventRange(recurrenceStr, date):
  date = datetime.datetime.combine(date, datetime.time())
  ruleStr = getRuleStr(recurrenceStr)
  params = ruleStr.split(';')

  count = getCount(recurrenceStr)
  firstDate = getStartTime(recurrenceStr)

  until = getUntil(recurrenceStr)
  if until:
    return firstDate < date and date < until

  if count < 0 and firstDate < date:
    return True

  freqStr = params[0][len('FREQ='):]

  if freqStr == 'WEEKLY':
    finalDate = firstDate + datetime.timedelta(weeks=count)
    return date < finalDate
  elif freqStr == 'MONTHLY':
    finalDate = firstDate.replace(month=firstDate.month + count)
    return date < finalDate
