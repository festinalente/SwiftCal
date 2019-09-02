# SwiftCal
##Description
SwiftCal was built out of frustration with preexisting JavaScript calendars.
* It has no dependencies (no jQuery),
* Written in ES5,
* It assumes a context for an event (i.e. time and place).

It allows a user to:
  1. Pick dates,
  2. Select ranges of dates,
  3. Pick times and multiple times,
  4. Set times and dates to be picked.

##Usage

###Loading pre-selected dates:

Preloaded dates take the following format. Note that months are counted from 0, so 11 in this example would be December:

 `var preloadedDates = [{"day":"2018-11-28"},{"day":"2018-11-29"}]`
