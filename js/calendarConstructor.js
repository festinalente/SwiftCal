function SwiftCal() {
	var disabled = false,
		//things we use:
		datesSelectedArrayObjects = [],
		//dates chosen by end user (if any)
		endUserSelection = [],
		//simply tracks the above array:
		endUserSelectionTrackingArray = [],
		//strings, easier to compare:
		datesSelectedArray = [],
		selectRange,
		keyDay,
		calendar,
		timeChooserModal,
		timeChooser,
		clickCount = 1,
		displayTimeG = false,
		inst = 0;
		times = {indexes: [], values: []},
		time = {};

		//swiftmoAlert.set();
	  //var preloadedDates = [{"day":"2018-11-28"},{"day":"2018-11-29"}];

  /*Private Functions*/
  /**
    * Book day
    * @description Books a day by adding it to the datesSelectedArray and it's tracking array.
    * @function bookDay
    * @param day is a html div with an id that refers to the date YYYY-MM-DD months are counted from 0.
    * @param date is a string YYYY-MM-DD months are counted from 0.
    */
  function bookDay(day, date){
    if(datesSelectedArray.includes(date) === false){
      day.style.backgroundColor = '#fc3';
      datesSelectedArray.push(date);
      datesSelectedArrayObjects[datesSelectedArray.length - 1] = {
        day: date,
        humanDate : humandate(date)
      };
    }
  }

  /**
    * Releasee booked day
    * @description removes a day that has been previously booked.
    * @function releaseBookedDay
    * @param day is a html div with an id that refers to the date YYYY-MM-DD months are counted from 0.
    * @param date is a string YYYY-MM-DD months are counted from 0.
    */
  function releaseBookedDay(day, date){
      var index = datesSelectedArray.indexOf(date);
      day.style.backgroundColor = '#fff';
      datesSelectedArray.splice(1, index);
      datesSelectedArrayObjects.splice(1, index);
  }

  /**
    * Range select
    * @description Allows a range of dates to be selected
    * @function rangeSelect
    * @todo allow range select to work with time values.
    * @fires bookDay for each day in a range
    */
  function rangeSelect(){
    var start = datesSelectedArrayObjects[0].day;
    var end = datesSelectedArrayObjects[1].day;
    var firstClicked = calendar.querySelector("[id='"+start+"']").dataset.dayindex;
    var secondClicked = calendar.querySelector("[id='"+end+"']").dataset.dayindex;

    var lowestVal = function(){
      if(firstClicked - secondClicked > 0){
        return [secondClicked, firstClicked];
      }
      else{
        return [firstClicked, secondClicked];
      }
    };

    var low = parseInt(lowestVal()[0]);
    var high = parseInt(lowestVal()[1]);

    for(var i = low; i <= high; i++){
			//best done via index as easilly itterable:
      var day = calendar.querySelector('[data-dayindex = "'+i+'"]');
      if(day.classList.contains('blocked')){
				//sets last clicked element to white if it falls beyond a blocked data
        calendar.querySelector("[id='"+end+"']").style.backgroundColor = 'white';
				//removes it:
        datesSelectedArray.splice(1,1);
				datesSelectedArrayObjects.splice(1,1);
        break;
      }

      var date = day.id;
      var blockDay = calendar.querySelector("[id='"+date+"']") ;
      bookDay(blockDay, date);

      if(i === high){
				//Place the dates in order:
				datesSelectedArray.push(datesSelectedArray.splice(1, 1)[0]);
				datesSelectedArrayObjects.push(datesSelectedArrayObjects.splice(1, 1)[0]);
			}
    }
  }

  /**
    * Generate times only
    * @description This simply generates a set of times on a particular date
    * @function generateTimesOnly
    * @param {?string[]} timeValues -An array of string representations of times ['09:00','12:00']
    * @param {!string] dayInPoint -A string with a date 'YYYY-MM-DD', this can be found on the id attribute of a day on the calendar where months start at 0, e.g. 4th january: '2020-00-04'
    */
  function generateTimesOnly(timeValues, dayInPoint){
		console.log('wank'+dayInPoint);
		console.log(timeValues);
    var textinternal = '';
    var target = document.getElementById(dayInPoint);
    timeValues.forEach(function(e, i){
      textinternal += e + ' ';

      var time = document.createElement('p');
          time.classList.add('calendarTime');
          time.style.marginBottom = '0px';
          time.textContent = textinternal;
      if(target.classList.contains('filler') === false){
        target.style.backgroundColor = '#fc3';
        if(i % 2 === 1){
          time.style.borderBottomStyle = 'solid';
          target.appendChild(time);
          textinternal = '';
        }
        else{
          target.appendChild(time);
          textinternal = '';
        }
      }
    });
  }

	/**
		* Generate times only
		* @description This simply generates a set of times on a particular date
		* @function generateTimesOnly
		* @param {?string[]} timeValues -An array of string representations of times ['09:00','12:00']
		* @param {!sting} dayInPoint -A string with a date 'YYYY-MM-DD' where months start at 0, e.g. 4th january: '2020-00-04'
		* @fires generateTimesOnly()
		*/
	function generateTimesOnCal(timeValues, dayInPoint){
		console.log('generateTimesOnCal');
		console.log(timeValues);
		console.log(dayInPoint);

		for(i = dayInPoint.children.length-1; i >= 0; i--){
			dayInPoint.children[i].remove();
		}
		var index = datesSelectedArray.indexOf(dayInPoint.id);
		datesSelectedArrayObjects[index].times = timeValues;
		generateTimesOnly(timeValues, dayInPoint.id);
	}

	/**
		* Resets time
		* @description This simply sets the time select boxes to zero and empties the time arrays
		* @function resetTimesAndGlobal
		*/
	function resetTimesAndGlobal(){
		for(var i = 0; i < times.indexes.length; i++){
			document.getElementsByClassName(times.indexes[i] + '-hh')[0].selectedIndex = 0;
			document.getElementsByClassName(times.indexes[i] + '-mm')[0].selectedIndex = 0;
		}

		for(var j = times.indexes.length; j >=0; j--){
			times.indexes.splice(j,1);
			times.values.splice(j,1);
		}
		//don't remove first element, time chooser redefined:
		var timeChooser = calendar.closest('timeChooser');
		for(var p = timeChooser.children.length-1; p > 0; p--){
			timeChooser.removeChild(timeChooser.children[p]);
			console.log(timeChooser.children[p]);
		}

	}

	/**
		* Release day of week
		* @function releaseDayOfWeekG
		* @param dayID id of the day to be released. N.b. day of week is stored as a data attribute
		* @todo make it use keyDay (which is the day in context)
		*/
	function releaseDayOfWeekG(dayId){
		//change dayId to key day
		var weekday = keyDay.dataset.dayofweek;
		var blockTheseDays = document.querySelectorAll("[data-dayofweek='" + weekday + "']");

			for(var i = 0; i < blockTheseDays.length; i++){
				var blockDay = document.getElementById(blockTheseDays[i].id);
				console.log(blockDay);
				console.log(keyDay);
				if(blockDay !== keyDay){
					releaseBookedDay(blockDay, blockTheseDays[i].id);
					removeTimeDisplay(blockTheseDays[i].id);
				}
				if(blockDay === keyDay){
					//do nothing
				}
			}

	}

/*
	function selectRange(el){
		clickCount++;
		if(clickCount % 2 === 0){
			datesSelectedArray.length = 0;
			datesSelectedArrayObjects.length = 0;

			var dayToWhite = document.getElementsByClassName('dayTime');
			for(var j = 0; j < dayToWhite.length; j++){
				console.log("pre"+JSON.stringify(preloadedDates));
				if(!dayToWhite[j].classList.contains('blocked')){
					dayToWhite[j].style.backgroundColor = 'white';
				}
			}
			//On first click, save it as per usual
			el.style.backgroundColor = '#fc3';
			bookDay(el, date);
		}
		else{
			//On second click, save it as per usual
			el.style.backgroundColor = '#fc3';
			bookDay(el, date);
			var firstChoice = document.getElementById(datesSelectedArrayObjects[0]);
			var lastChoice = document.getElementById(datesSelectedArrayObjects[datesSelectedArrayObjects.length-1]);
			var dayCount = firstChoice.dataset.dayindex - lastChoice.dataset.dayindex;
			console.log(firstChoice);
			console.log(lastChoice);
			console.log(dayCount);
			for(var i = 0; i < dayCount; i++){

			}
			bookDay(el, date);
			rangeSelect();

		}
	}
*/
	/** Date on click event
		* @function dateOnClickEvents
		* @param the event that fires this.
		* @fires bookDay()
		* @fires rangeSelect()
		* @fires adjustPosition()
		* @todo Write it so it selects elements by class and not by id. Remove ids completely actually. As in el.closest('#timeChooserModal');
		*/
  function dateOnClickEvents(e) {
    var el = e.target;
		//keyDay = el;
    clickCount++;
    if(el.classList.contains('blocked')){
      return;
    }

    var day = el.dataset.day;
    var month = el.parentElement.parentElement.dataset.month;
    var year = el.parentElement.parentElement.dataset.year;
    var date = makeDate(year, month, day);

    //no, go back
    if(disabled === true){
      return;
    }
    //this deals only with ranges, if not returned the following code deals
    //with individual days.
    if(selectRange === true){
      //multiple selections can be made by disabling this part of the code.
      //n.b. originaly bug meant this evaluated as true.
      if(clickCount % 2 === 0){
        datesSelectedArray.length = 0;
        datesSelectedArrayObjects.length = 0;

        var dayToWhite = document.getElementsByClassName('dayTime');
        for(var i = 0; i < dayToWhite.length; i++){
          console.log("pre"+JSON.stringify(preloadedDates));
          if(!dayToWhite[i].classList.contains('blocked')){
            dayToWhite[i].style.backgroundColor = 'white';
          }
        }

        el.style.backgroundColor = '#fc3';
        bookDay(el, date);
      }
      if(clickCount % 2 === 1){
				console.log('rangeSelect ' + clickCount);
        bookDay(el, date);
        rangeSelect();
      }
      return;
    }

    if(datesSelectedArray.includes(date) === false) {
      console.log('day function' + displayTimeG);
      bookDay(el, date);

      //display time picker
      if(displayTimeG === true) {


				timeChooserModal.style.height = calendar.clientHeight + "px";
				timeChooserModal.style.width = calendar.clientWidth + "px";
    		timeChooserModal.style.display = 'inline';
				console.log('timeChooser'+timeChooser);
        adjustPosition(timeChooser, calendar);
      }
    }
    else {
      //this all deletes a day selectiong: n.b. not in separate function like range
      // select which just reset the entire selection pertaining to it.
      el.style.backgroundColor = 'white';

      datesSelectedArray.splice(datesSelectedArray.indexOf(date), 1);
      datesSelectedArrayObjects.splice(datesSelectedArray.indexOf(date), 1);

      //removes any time divs on deselect
      if(displayTimeG === true){
        while(el.firstChild){
          console.log('troublesome this');
          console.log(el);
          el.removeChild(el.children[0]);
        }
      }

    }
  }

	/* Helpful functions:
	 * gets month in JS ((monthNow + i + 1)% 12)
	 * gets days in month  getDaysInMonth(((monthNow + i + 1)% 12), new Date().addMonths(i).getFullYear())
	 * gets month in human new Date().addMonths(i).getFullYear())
	 * gets year new Date().addMonths(i).getFullYear())
	 * get first day of month new Date(new Date().addMonths(i).getFullYear()), ((monthNow + i + 1)% 12));
	 */

	/**
	 * var getDaysInMonth - Get number of days in month
	 *
	 * @param  {!number} month The number of the corresponding month.
	 * @param  {!number} year  The corresponding year.
	 * @return {number} Returns a number corresponding to the number of days for the date in point.
	 */
	var getDaysInMonth = function(month, year) {
		return new Date(year, month, 0).getDate();
	};


	/**
		* @memberof Date
		* @param months to add;
		* @description adds months to a date, (e.g. 2019-10-20 + 4 months) = 2020-2-20;
		*/
	Date.prototype.addMonths = function(m) {
		var d = new Date(this);
		var years = Math.floor(m / 12);
		var months = m - years * 12;
		if (years) d.setFullYear(d.getFullYear() + years);
		if (months) d.setMonth(d.getMonth() + months);
		return d;
	};

	/** Make date
	  * @function make Date
		* @param year -4 digit year
		* @param month -2 digit month
		* @param day -2 digit day
		* @description returns a sting representation of a day e.g.: '2019-10-04'
		*/
	function makeDate(year, month, day) {
		var date = year + '-' + month + '-' + day;
		return date;
	}

	/** Human date
	  * @function Human date
		* @param date -'2019-10-04'
		* @description Adds a 1 to the month in a date to make it comprehensible by humans.
		*/
	function humandate(date){
    var humanDateSplit = date.split('-');
    var humanDate = humanDateSplit[0] + '-' + (parseInt(humanDateSplit[1]) + 1) + '-' + humanDateSplit[2];
    return humanDate;
  }

	/** Make button
		* @description re write of a lost function that makes a little circular button with a letter of symbol in it. It passes the click event along to the function that is assigned to handle it.
		* @param parent The parent element you wish to attach the parent to.
		* @param id The id you wish the button to have.
		* @param character The caracter you wish the button to have (e.g. +, -, x);
		* @param title The title attribute for the button
		* @param fn The function you wish to be called on button click
		* @todo Make so various actions can be applied rather than just click.
		*/
	function makeButton(parent, id, character, title, fn){
		var base = document.createElement('p');
				base.id = id;
				base.textContent = character;
				parent.appendChild(base);
				base.title = title
				base.addEventListener('click', function(e){
					fn(e)
				});
	}

	/** Block a particular day of the week (e.g. sabath)
		* @description Takes a sample day (e.g. 2019-10-20), gets the day of week via data attribute and block all other days with this attribute value
		* @param string dayId The ID of the sample day e.g. '2019-12-10'
		* @param inst number The instance if not using globally defined instance.
		*/
	function bookDayOfWeekG(dayId, inst){
		var weekday = document.getElementById(dayId).dataset.dayofweek;
		var blockTheseDays = document.querySelectorAll("[data-dayofweek='" + weekday + "']");
		blockTheseDays.forEach(function(e, i){
			if(e.classList.contains('filler') === false){
				var day = document.getElementById(e.id);
				bookDay(day, e.id);
				addTimeDisplay(e.id, inst);
			}
		});
	}

	/**
		* close modal
		* @funtion closeModal()
		* @desctription Closes the time chooser modal then resets times
		*/
	function closeModal(e){
		//hide display modal
		e.target.closest('.timeChooserModal').style.display = 'none';
		resetTimesAndGlobal();
	}

	/**
		* Remove time(chooser div)
		* @function removeTime()
		* @description removes the last time chooser and times made
		*/
	function removeTime(){
		var timeChooser = calendar.closest('.timeChooser');
		var makeTimeRuleGlobal = timeChooser.closest('.makeTimeRuleGlobal-0');
		//remove one or two times depending:
		if(times.indexes.length > 2){
			if(timeChooser.children.length > 1){
				timeChooser.removeChild(timeChooser.children[timeChooser.children.length-1]);
			}
			if(times.indexes.length % 2 === 0){
				times.indexes.splice(times.indexes.length-2, 2);
				times.values.splice(times.values.length-2, 2);
			}
			else{
				times.indexes.splice(times.indexes.length-1, 1);
				times.values.splice(times.values.length-1, 1);
			}
		}else{
			console.log('less than 2');
			resetTimesAndGlobal();
			//hacky way to return to desired state
			makeTimeRuleGlobal.click();
		}
		//hacky way to return to desired state
		makeTimeRuleGlobal.click();
		makeTimeRuleGlobal.click();
	}

	/**
		* Make time element
		* @function makeTimeElements
		* @param {HTMLElement} div
		* @returns A div in the modal with a time selector
		*/
	function makeTimeElements(calendar){
		//Base:
		timeChooserModal = document.createElement('div');
				timeChooserModal.classList.add('timeChooserModal');
				//timeChooserModal.id = 'timeChooserModal';
				calendar.appendChild(timeChooserModal);
				console.log(timeChooserModal);
		var timeCont = document.createElement('div');
				timeCont.classList.add('timeCont');
				timeChooserModal.appendChild(timeCont);

		timeChooser = document.createElement('div');
				timeChooser.classList.add('timeChooser');
				timeCont.appendChild(timeChooser);

		var deleteDiv = document.createElement('div');
				deleteDiv.classList.add('deleteDiv');
				//makeButton(parent, id, character, title, fn)
				makeButton(deleteDiv, 'addTime', '+', 'add a time', innerComponents);
				makeButton(deleteDiv, 'removeTime', '-', 'remove last time', removeTime);
				makeButton(deleteDiv, 'deleteButton', 'x', 'close', closeModal);
				timeChooser.appendChild(deleteDiv);

			return this;
	};



	/**
	 * innerComponents - description
	 *
	 * @return {type}  description
	 */
	function innerComponents(){
		timePickerContainer = document.createElement('div');
		timeChooser.appendChild(timePickerContainer);

		var deleteDiv = document.createElement('div');
				deleteDiv.textContent = 'Add time:';
				deleteDiv.classList.add('deleteDiv');
				timePickerContainer.appendChild(deleteDiv);

		var instInternal = inst;

				maketime('Start', timePickerContainer, instInternal);
				maketime('End', timePickerContainer, instInternal);
				tickboxes(timePickerContainer);
				inst++;
	}


	/**
	 * tickboxes - description
	 *
	 * @param  {HTMLElement} timePickerContainer This is the HTML element to which the checkbox will be appended.
	 * @return {HTMLElement} Returns a HTML checkbox to select all days of a particular type (e.g. all Mondays).
	 */
	function tickboxes(timePickerContainer){
		var timeCont = timePickerContainer;
		var dow = parseInt(keyDay.dataset.dayofweek);
		var daysInFull = ['Sun', 'Mon', 'Tues', 'Wednes', 'Thurs', 'Fri', 'Satur'];
		var labelfor = document.createElement('p');

		if(inst === 0){
					labelfor.textContent = 'Set these times for all ' + daysInFull[dow] + 'days';
					labelfor.classList.add('timeSelectP');

					timeCont.appendChild(labelfor);

			var makeTimeRuleGlobal = document.createElement('input');
					makeTimeRuleGlobal.setAttribute('type', 'checkbox');
					makeTimeRuleGlobal.name = 'makeTimeRuleGlobal';
					makeTimeRuleGlobal.classList.add('makeTimeRuleGlobal-' + inst);

					timeCont.appendChild(makeTimeRuleGlobal);

			makeTimeRuleGlobal.addEventListener('click', function(e){
				if(makeTimeRuleGlobal.checked === false){
					releaseDayOfWeekG(keyDay.id);
				}
				else{
					bookDayOfWeekG(keyDay.id, inst);
				}
			});
		}
		else{
			labelfor.textContent = 'Set these times for all ' + daysInFull[dow] + 'days';
			return;
		}
	}

	function maketime(startEnd, appendTo, instInternal){
		var startContainer = document.createElement('div');
				startContainer.classList.add('timeContainer');

		var startLabel = document.createElement('p');
				//startLabel.setAttribute('for', startEnd+'Hour');
				startLabel.classList.add('timeSelectP');
				startLabel.textContent = startEnd + ':';
				startContainer.appendChild(startLabel);

		var hourSelect = document.createElement('div');
				hourSelect.id = startEnd + '-' + instInternal;
				if(instInternal){
					hourSelect.classList.add(instInternal);
				}
				hourSelect.classList.add('hour', 'times', startEnd);
				startContainer.appendChild(hourSelect);
				makeSelector('hh', 24, hourSelect.id, hourSelect, startEnd, instInternal);
				makeSelector('mm', 59, hourSelect.id, hourSelect, startEnd, instInternal);

		appendTo.appendChild(startContainer);
	}

	function makeSelector(type, limit, id, parent, startEnd, instInternal){
		time[type] = '00';

		var h = document.createElement('select');
				h.classList.add(type, id + '-' + type, 'timeSelect');

		var i = 0;
		var placeholder = document.createElement('option');
				placeholder.textContent = type;
				placeholder.value = '00';
				h.appendChild(placeholder);

		while (i <= limit){
			var hour = document.createElement('option');
			//leading zero on single digit numbers:
			var text = i.toString();
			if (text.length === 1){
				text = '0' + i;
			}

			hour.value = text;
			hour.textContent = text;
			h.appendChild(hour);
			i++;
		}

		h.addEventListener('click', function(){
			time[type] = h.value;
			if(type === 'hh'){
				time.mm = '00';
				h.nextSibling.selectedIndex = '1';
			}

			if(!times.indexes.includes(startEnd+ '-' + instInternal)){
				times.indexes.push(startEnd+ '-' + instInternal);
				times.values.push(time.hh + ':' + time.mm);
			}
			else{
				var index = times.indexes.indexOf(startEnd+ '-' + instInternal);
				times.values[index] = time.hh + ':' + time.mm;
			}

			addTimeDisplay(null, instInternal);
		});

		parent.appendChild(h);
	}

	function adjustPosition(element, targetCalendar){
		//position Time picker:
		var calCoordinates = targetCalendar.getBoundingClientRect();
		var x = calCoordinates.x;
		var y = calCoordinates.y;
		var calWidth = calCoordinates.width;
		var timeChooserCoordinates = element.getBoundingClientRect();
		var tWidth = timeChooserCoordinates.width;
		//var topCo = y + 50;
		var topCo =  y + 10;
		var leftCo = x + ((calWidth - tWidth) / 2);
		element.style.top = topCo + "px";
		element.style.left = leftCo + "px";
	}

	function addTimeDisplay(dayInPoint, inst){
		if(dayInPoint === null/* && inst >= 0*/){
			console.log('null and inst');
			if(document.getElementsByClassName('makeTimeRuleGlobal-0')[0].checked){
				bookDayOfWeekG(keyDay.id, inst);
			}
			else{
				generateTimesOnCal(times.values, keyDay);
			}

		}
		if(dayInPoint/* && inst >= 0*/){
			var target = document.getElementById(dayInPoint);
			generateTimesOnCal(times.values, target);
		}
	}

	this.collectEndUserSelection = function() {
		return endUserSelection;
	};

	this.datesSelected = function() {
		return datesSelectedArrayObjects;
	};

	this.datesSelectedTracker = function() {
		return datesSelectedArray;
	};

	this.clearSelection =  function(){
		datesSelectedArrayObjects.forEach(function(e, i){
			document.getElementById(e.day).style.backgroundColor = '#fff';
			datesSelectedArrayObjects.splice(1, i);
		});
	};


	this.disable =  function(){
		disabled = true;
	},

	/**
	 * rangeOption - description
	 *
	 * @param  {type} boolean description
	 * @return {type}         description
	 */
	this.range = function rangeOption(boolean){
		selectRange = boolean;
		return this;
	};

	/**
		* Make calendar
		* @function make Calendar
		* @memberof SwiftCal
		* @param {!string} parentDiv The div you wish to attach the calendar to. Required.
		* @todo make parentDiv take any element via class or id, rather than just id
		* @param {?string[]} preloadedDates Array Dates you wish to display on the calendar or null
		* @param {number} [n=4]preloadedDates Number Number of months to display or defaults to 4
		* @param {?boolean} displayTime Boolean displays time option, defaults to false
		* @param {?boolean} endUser Boolean, Limits function to an end user (i.e. client of a client)
		* @param {?string[]} n endUserDurationChoice Array, loads dates provided by an end user.
		* @param {?boolean} backend Boolean Makes available backend functionality.
		*/
	this.calendar = function makeCalendar(parentDiv, preloadedDates,
		numberOfMonthsToDisplay, displayTime, endUser, endUserDurationChoice, backend) {
		//Calendar is defined globally within the constructor
		calendar = document.createElement('div');
		calendar.classList.add('calendar');
		document.getElementById(parentDiv).appendChild(calendar);

		if(displayTime === true){
			displayTimeG = true;
			makeTimeElements(calendar);
		}

		function attach(elem) {
			elem.addEventListener('click', function() {
				if (endUserSelectionTrackingArray.includes(elem.id)) {
					elem.style.borderStyle = 'none';
					endUserSelection.splice(endUserSelectionTrackingArray.indexOf(elem.id), 1);
					endUserSelectionTrackingArray.splice(
					endUserSelectionTrackingArray.indexOf(elem.id), 1);
				} else {
					elem.style.borderStyle = 'solid';
					elem.style.borderColor = 'blue';
					var timeConstraint = elem.children[0].textContent.split(' ');
					//min should be user defined by the guide in a data attribute:
					var min = 1;
					var max = parseInt(timeConstraint[1]) -
						parseInt(timeConstraint[0]);
					var times = document.getElementById(elem.id)
						.firstChild.nextSibling.textContent;
					endUserSelection.push({
						day: elem.id,
						duration: min,
						timeGap: times,
						humanDate: humandate(elem.id)
					});
					endUserSelectionTrackingArray.push(elem.id);
					//toggle duration
					if (endUser === true && endUserDurationChoice === true) {
						console.log('end user' + endUser + endUserDurationChoice);
						toggleDuration(elem.id, min, max);
						adjustPosition('durationChooser', calendar);
						document.addEventListener('click', function(
							event) {
							var isClickInside = document
								.getElementById(
									'durationInput')
								.contains(event.target);
							if (isClickInside) {
								saveClientDateDuration();
							}
							if (!isClickInside && event
								.target === document
								.getElementById(
									'durationChooserModal')
							) {
								document.getElementById(
										'durationChooserModal'
									).style.display =
									'none';
								saveClientDateDuration();
							}
						});
					}
				}
			});
		}

		function durationChooser() {
			var modal = document.createElement('div');
					modal.classList.add('timeChooserModal');
					modal.id = 'durationChooserModal';

			var durationChooser = document.createElement('div');
					durationChooser.classList.add('timeChooser');
					durationChooser.id = 'durationChooser';

					modal.appendChild(durationChooser);
					calendar.appendChild(modal);

			var deleteDiv = document.createElement('div');
					deleteDiv.textContent = 'Duration:';
					deleteDiv.classList.add('deleteDiv');
					durationChooser.appendChild(deleteDiv);

			makeButton(deleteDiv, 'deleteButton', 'x', 'close', closeModal);

			var Container = document.createElement('div');
					Container.classList.add('timeContainer');

			var Label = document.createElement('label');
					Label.setAttribute('id', 'calendarLabel');
					Label.setAttribute('for', 'hourSelect');
					Label.textContent = 'hours:';
					Container.appendChild(Label);

			var hourSelect = document.createElement('input');
					hourSelect.setAttribute('type', 'number');
					hourSelect.id = 'durationInput';
					hourSelect.classList.add('hour');
					Container.appendChild(hourSelect);
					durationChooser.appendChild(Container);
		}

		function toggleDuration(day, min, max) {
			document.getElementById('durationInput').setAttribute('min',
				min);
			document.getElementById('durationInput').setAttribute('max',
				max);
			document.getElementById('durationInput').value = '1';
			document.getElementById('durationChooserModal').style.height =
				calendar.clientHeight + "px";
			document.getElementById('durationChooserModal').style.width =
				calendar.clientWidth + "px";
			document.getElementById('durationChooserModal').style.display =
				'inline';
		}

		function saveClientDateDuration() {
			var duration = document.getElementById('durationInput').value;
			endUserSelection[endUserSelection.length - 1].duration =
				duration;
		}
		//afterCalendarInit CALL swiftCal() range before instantiating the caledar

		function preloadDatesFn(calendar, dates) {
			if(dates){
				//Assign dates to datesSelectedArrayObjects.
				datesSelectedArrayObjects = dates;
				for(var i = 0; i <= dates.length-1; i++){
					//Hacky way to get the id with an interger as a first character:
					var dateId = "[id='"+dates[i].day+ "']";
					//Make sure element exists in the calendar
					//Query selector is used to search a specified calendar and not the dom in general:
					if (calendar.querySelector(dateId) !== null) {
						//Fill the tracking array:
						datesSelectedArray.push(dates[i].day);

						calendar.querySelector(dateId).style.backgroundColor = '#fc3';
						calendar.querySelector(dateId).classList.add('available');
						//endUser option with durations!
						if (endUser === true) {
							attach(calendar.querySelector(dateId));
							//end user duration Chooser, rest of code at top of file
							durationChooser();
						}
						if (displayTimeG === true) {
							generateTimesOnly(dates[i].times, dates[i].day);
						}

						if (selectRange === true && calendar.querySelector(dateId) !== null && calendar.querySelector(dateId).classList.contains('filler') === false) {
							//use preloaded dates directly blocked.push(preloadedDates[i].day);
							calendar.querySelector(dateId).style.backgroundColor = '#333';
							calendar.querySelector(dateId).classList.add('blocked');
							calendar.querySelector(dateId).title = 'No availability on this day';

							var soldOut = document.createElement('p');
									soldOut.classList.add('calendarTime');
									soldOut.textContent = 'Sold out';
							calendar.querySelector(dateId).appendChild(soldOut);
						}
					}
				}
			} else {
				return;
			}
		}

		if (numberOfMonthsToDisplay === undefined) {
			numberOfMonthsToDisplay = 4;
		}

		if (backend === true) {
			console.log(backend);
			var dayblock = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri',
				'Sat'
			];
			var dayblockrow = document.createElement('div');
			dayblockrow.classList.add('dayblockrow');
			var title = document.createElement('h4');
			title.textContent = 'Select days of week to block:';
			dayblockrow.appendChild(title);
			dayblock.forEach(function(e, i) {
				var input = document.createElement('input');
				input.setAttribute('type', 'checkbox');
				input.classList.add('block');
				input.name = e;
				input.dataset.block = dayblock.indexOf(e);
				dayblockrow.appendChild(input);
				var label = document.createElement('label');
				label.for = e;
				label.textContent = e;
				dayblockrow.appendChild(label);
			});
			calendar.appendChild(dayblockrow);
			//FUNCTION FOR BLOCKING ALL DAYS OF A TYPE:
			if (backend) {
				var daysToBlock = document.getElementsByClassName('block');
				for (i = 0; i < daysToBlock.length; i++) {
					daysToBlock[i].addEventListener('click', function(e) {
						console.log(e);
						var blockTheseDays = document
							.querySelectorAll("[data-dayofweek='" +
								e.target.dataset.block + "']");
						if (e.target.checked) {
							for (i = 0; i < blockTheseDays
								.length; i++) {
								blockTheseDays[i].classList.add(
									'widthShape', 'filler');
							}
						} else {
							for (i = 0; i < blockTheseDays
								.length; i++) {
								blockTheseDays[i].classList.remove(
									'filler');
							}
						}
					});
				}
			}
		}
		var months = [];
		var dateNow = new Date();
		var monthNow = dateNow.getMonth();
		var yearNow = dateNow.getFullYear();
		var monthNames = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December'
		];

		//This basically just gives each day a unique index to make for easier
		//comparison. Useless outside this context.
		var uniqueDayIndex = 0;
		//make months
		for (var i = 0; i < numberOfMonthsToDisplay; i++) {
			months.push(document.createElement('div'));
			calendar.appendChild(months[i]);
			months[i].style.width = '15em';
			months[i].style.backgroundColor = '#f15925';
			months[i].classList.add('month');
			//make month name
			var month = document.createElement('div');
			month.textContent = monthNames[(monthNow + i) % 12];
			month.classList.add('monthName');
			months[i].appendChild(month);
			//make week row
			var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
			var weekrow = document.createElement('div');
			weekrow.classList.add('weekrow');
			months[i].appendChild(weekrow);
			days.forEach(function(e) {
				var day = document.createElement('div');
				weekrow.appendChild(day);
				day.textContent = e;
				day.classList.add('dayName', 'widthShapeDays');
			});
			//make days:
			var pegholes = [];
			var weekrow1 = document.createElement('div');
			months[i].appendChild(weekrow1);
			weekrow1.classList.add('weekrow');
			//Days and date information:
			var yearCalc = new Date().addMonths(i).getFullYear();
			var monthCalc = (monthNow + i) % 12;
			var startDayOfMonth = new Date(yearCalc, monthCalc).getDay();
			var datenow = new Date().getDate();
			var daysinMonth = getDaysInMonth(
				(monthNow + i + 1) % 12,
				new Date().addMonths(i).getFullYear()
			);
			months[i].dataset.year = yearCalc;
			months[i].dataset.month = monthCalc;
			months[i].id = monthCalc + '-' + yearCalc;
			//Day count:
			var count = 1;
			var dayofweek = 0;
			//p accounts for "spilage" off days into incomplete weeks (6 therefore 42 slots, some empty).
			for (p = 0; p <= 41; p++) {
				if (p < startDayOfMonth) {
					pegholes.push(document.createElement('div'));
					pegholes[p].classList.add('widthShape', 'filler');
					weekrow1.appendChild(pegholes[p]);
					pegholes[p].style.backgroundColor = 'white';
					//pegholes[p].dataset.dayofweek = dayofweek;
					dayofweek++;
				}
				//New edit. Blocks past dates in month 0. Make it an option to select past dates?
				//i referes to month (current month) the limit at the end is date now, plus the empty
				//boxes at the start of the month, minus one to give today as available
				if (i === 0 && p >= startDayOfMonth && p < (datenow +
						startDayOfMonth - 1)) {
					pegholes.push(document.createElement('div'));
					pegholes[p].classList.add('widthShape', 'filler');
					weekrow1.appendChild(pegholes[p]);
					pegholes[p].style.backgroundColor = 'white';
				}
				if (p >= startDayOfMonth && p < daysinMonth +
					startDayOfMonth) {
					pegholes.push(document.createElement('div'));
					pegholes[p].textContent = count;
					pegholes[p].dataset.day = count;
					pegholes[p].dataset.dayofweek = dayofweek;
					pegholes[p].dataset.dayindex = uniqueDayIndex;
					weekrow1.appendChild(pegholes[p]);
					pegholes[p].classList.add('widthShape', 'dayTime');
					//doing
					pegholes[p].id = yearCalc + '-' + monthCalc + '-' +
						count;
					pegholes[p].addEventListener('click', dateOnClickEvents,
						false);
					count++;
					dayofweek++;
					uniqueDayIndex++;
				}
				if (p >= daysinMonth + startDayOfMonth) {
					pegholes.push(document.createElement('div'));
					pegholes[p].classList.add('widthShape', 'filler');
					weekrow1.appendChild(pegholes[p]);
					pegholes[p].style.backgroundColor = 'white';
				}
				if ((p + 1) % 7 === 0) {
					weekrow1 = document.createElement('div');
					months[i].appendChild(weekrow1);
					weekrow1.classList.add('weekrow');
					dayofweek = 0;
				}
			}
			if (i === numberOfMonthsToDisplay - 1) {
				preloadDatesFn(calendar, preloadedDates);
			}
		}
		return this;
	};
}

var cal = new SwiftCal();
cal.calendar('div',null, 1, true, null, null, true);

//Preloaded dates uses the JS equivalent date (i.e. +1 on month)
var preloadedDates = [{day: '2019-8-29'},{day : '2019-8-30'}];
var calTestPreloaded = new SwiftCal().calendar('div', preloadedDates);

var calTestEndUser = new SwiftCal().calendar('div', preloadedDates, 2, null, true);
