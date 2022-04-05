(function () {
  const widgetClassName = 'day-by-day';

  document.addEventListener('DOMContentLoaded', () => {
    const widgetContainers = document.querySelectorAll(`.${widgetClassName}`);
    for (let container of widgetContainers) {
      new DayByDay(container);
    }
  });

  class DayByDay {
    /** @private @const {!Node} */
    #container;
    /** @private @const {!Date} */
    #date;

    /**
     * @param {!Node} container The element that the user wants to load the day-by-day calendar widget into.
     */
    constructor(container) {
      this.#container = container;
      this.#date = new Date();
      this.#show(this.#date);
    }

    #show(date) {
      this.#container.innerHTML = '';
      this.#container.appendChild(this.#makeHeader(date));
      this.#container.appendChild(this.#makeArrow('left'));
      this.#container.appendChild(this.#makeCalendar(date));
      this.#container.appendChild(this.#makeArrow('right'));
    }

    #makeHeader(date) {
      const monthName = date.toLocaleString('default', { month: 'long' });
      const year = date.getFullYear();
      const header = document.createElement('h1');
      header.className += 'month-name';
      header.innerText = `${monthName} ${year}`;
      return header;
    }

    #makeArrow(side) {
      const arrowContainer = document.createElement('div');
      arrowContainer.className += 'arrow';
      const arrowButton = document.createElement('button');
      if (side == 'left') {
        arrowButton.className += 'left-arrow';
        arrowButton.innerHTML = '&laquo;';
        arrowButton.addEventListener('click', () => {
          this.#previousMonth();
        });
      } else {
        arrowButton.className += 'right-arrow';
        arrowButton.innerHTML = '&raquo;';
        arrowButton.addEventListener('click', () => {
          this.#nextMonth();
        });
      }
      arrowContainer.appendChild(arrowButton);
      return arrowContainer;
    }

    #makeCalendar(date) {
      const calendar = document.createElement('div');
      calendar.className += 'calendar';
      const dayHeadings = document.createElement('div');
      dayHeadings.className += 'day-of-week';
      let currentDay = new Date(); // to loop through the locale's week day names
      currentDay.setDate(currentDay.getDate() - currentDay.getDay()); // get a sunday (just use most recent one)
      for (let i = 0; i < 7; i++) {
        const initial = currentDay.toLocaleString('default', { weekday: 'short' })[0];
        const dayHeading = document.createElement('div');
        dayHeading.className += (i % 6) ? 'weekday' : 'weekend';
        dayHeading.innerText = initial;
        dayHeadings.appendChild(dayHeading);
        currentDay.setDate(currentDay.getDate() + 1);
      }
      calendar.appendChild(dayHeadings);
      const dateGrid = document.createElement('div');
      dateGrid.className += 'date-grid';
      currentDay = new Date(date.getFullYear(), date.getMonth(), 1); // get the first day of the view date's month
      currentDay.setDate(currentDay.getDate() - currentDay.getDay()); // get the most recent sunday to the first day of the month
      const finalDate = new Date(date.getFullYear(), date.getMonth() + 1, 0); // the final date of this month
      finalDate.setDate(finalDate.getDate() + 6 - finalDate.getDay()); // the last date in the view will be the saturday after the month ends
      while (currentDay <= finalDate) {
        const dateCell = document.createElement('button');
        if (currentDay.getMonth() != date.getMonth()) {
          dateCell.className += 'other-month';
        }
        if (currentDay.setHours(0,0,0,0) == (new Date()).setHours(0,0,0,0)) {
          dateCell.className += 'today';
        }
        const time = document.createElement('time');
        time.dateTime = `${currentDay.getFullYear()}-${currentDay.getMonth() + 1}-${currentDay.getDate()}`;
        time.innerText = currentDay.getDate();
        dateCell.appendChild(time);
        dateGrid.appendChild(dateCell);
        currentDay.setDate(currentDay.getDate() + 1);
      }
      calendar.appendChild(dateGrid);
      return calendar;
    }

    #previousMonth() {
      this.#date.setMonth(this.#date.getMonth() - 1);
      this.#show(this.#date);
    }

    #nextMonth() {
      this.#date.setMonth(this.#date.getMonth() + 1);
      this.#show(this.#date);
    }
  }
}());
