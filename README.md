# SwiftCal
## Description
SwiftCal was built out of frustration with preexisting JavaScript calendars.
* It has no dependencies (no jQuery),
* Written in ES5, to the best of my knowledge[...],
* It assumes a context for an event (i.e. time and place), rather regionalisation via Date() (although this can easilly be done with the outputs).

It allows a user to:
  1. Pick dates,
  2. Select ranges of dates,
  3. Pick times and multiple times,
  4. Set times and dates to be picked.
  
## Main modes: 
* Simple calendar,
* Range select, 
* Preloaded dates that can be selected,
* Preloaded dates that can't be selected. 
* Unlimited selection of time gaps (many time gaps begins to look messy), for 2-3 time gaps it looks fine. 

## Default behaviours:
* Checks for and alerts for overlapping dates,
* Checks when times are picked that end time occurs after start time,
* Orders pairs times (i.e. a time gap) chronologically on display, but stores them in the order they arrive,
* AFAIK, does not play nice with times selected over midnight (e.g. ['23:00', '01:00']), this was not in the original use case, so wasn't added. 
* If time selection option is passed and a date is provided without any times selected, this date is removed from the selectio,
* Range select wont allow a range to include preloaded dates truncating the selection on the date prior to the first preloaded date it encounters. 

## Usage

### Loading pre-selected dates:

Preloaded dates take the following format. Note that months are counted from 0, so 11 in this example would be December:

 `var preloadedDates = [{"day":"2018-11-28"},{"day":"2018-11-29"}]`

## TODOs
* Does not play nice with times selected over midnight (e.g. ['23:00', '01:00']), maybe make it so.
* Make it display many timegaps for a given day more neatly.
