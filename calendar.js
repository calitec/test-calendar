const APP = document.querySelector("#app");
const NAV_WRAPPER = document.querySelector(".year-month");
const DAYS_WRAPPER = document.querySelector(".days");
const DATES_WRAPPER = document.querySelector(".dates");
const TODAY = new Date();
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAYS_FULL_LENGTH = DAYS.length;
const SAVED_STORAGE = localStorage.getItem("calendar");
let parsedStorage = JSON.parse(SAVED_STORAGE) ?? []; // initialize
let current = TODAY;

// calendar
function factoryDate(realDate) {
  const year = realDate.getFullYear();
  const month = realDate.getMonth();
  const date = realDate.getDate();

  return {
    prevLastDate: new Date(year, month, 0).getDate(),
    prevLastDay: new Date(year, month, 0).getDay(),
    thisLastDate: new Date(year, month + 1, 0).getDate(),
    thisLastDay: new Date(year, month + 1, 0).getDay(),
    currentYear: new Date(year, month, date).getFullYear(),
    currentMonth: new Date(year, month + 1, date).getMonth(),
    currentDate: new Date(year, month + 1, date).getDate(),
  };
}

function makeMonthYearRow(realDate) {
  const { currentYear, currentMonth } = factoryDate(realDate);
  let yearmonth = "";
  yearmonth = `<div class="year-month"><em>${currentMonth}</em> ${currentYear}</div>`;
  return yearmonth;
}

function makeDatesRows(realDate) {
  const {
    currentYear,
    currentMonth,
    prevLastDate,
    prevLastDay,
    thisLastDate,
    thisLastDay,
  } = factoryDate(realDate);

  const fullWeeks = [];
  const fullDates = [];

  // days
  for (let i = 0; i < DAYS_FULL_LENGTH; i++) {
    fullWeeks.push(`
        <div>${DAYS[i]}</div>
      `);
  }

  // prev month dates
  for (let i = prevLastDate - prevLastDay; i <= prevLastDate; i++) {
    fullDates.push(`
        <div class="date prevmonth-date" 
        data-date="${new Date(
          `${currentYear}-${currentMonth - 1}-${i}`
        ).toDateString()}">
        ${i}</div>`);
  }

  // this month dates
  for (let i = 1; i <= thisLastDate; i++) {
    fullDates.push(`
        <div class="date thismonth-date" data-date="${new Date(
          `${currentYear}-${currentMonth}-${i}`
        ).toDateString()}">${i}</div>
      `);
  }

  // next month dates
  for (let i = 1; i < DAYS_FULL_LENGTH - thisLastDay; i++) {
    fullDates.push(`
        <div class="date nextmonth-date" data-date="${new Date(
          `${currentYear}-${currentMonth + 1}-${i}`
        ).toDateString()}">${i}</div>
      `);
  }

  return {
    days: fullWeeks.join(""),
    dates: fullDates.join(""),
  };
}

function renderCalendar(realDate) {
  const yearmonth = makeMonthYearRow(realDate);
  const { days, dates } = makeDatesRows(realDate);

  NAV_WRAPPER.innerHTML = yearmonth;
  DAYS_WRAPPER.innerHTML = days;
  DATES_WRAPPER.innerHTML = dates;
}

function getDuration(start, end) {
  // start, end are Date Objects
  const DURATION = (end.getTime() - start.getTime()) / 86400000; // 86400000 == 24h -> milliseconds
  const THIS_DAY = Number(start.getDay());

  return {
    duration: DURATION,
    sliced_length: DAYS_FULL_LENGTH - THIS_DAY,
    rest_length: DURATION - (DAYS_FULL_LENGTH - THIS_DAY),
  };
}

function renderLabel(parsedStorage) {
  if (parsedStorage != null) {
    parsedStorage.forEach((storageItem) => {
      // renderAdditionalLabel arguments
      const STORE_ITEM = {
        start: new Date(storageItem.start),
        end: new Date(storageItem.end),
        content: storageItem.content,
        color: storageItem.color,
      };

      const { start, end, content, color } = STORE_ITEM;
      const { duration } = getDuration(start, end);

      document.querySelectorAll(".date").forEach((dom, index) => {
        if (dom.dataset.date === start.toDateString()) {
          const SPAN = document.createElement("span");
          SPAN.innerHTML = content;
          SPAN.classList.add(color === "red" ? "red" : "blue");

          // when label has extra length
          if (duration > 1) {
            sliceByWeek(dom, index, SPAN, STORE_ITEM);
          } else {
            // when date length 1
            dom.appendChild(SPAN);
          }
        }
      });
    });
  }
}

function sliceByWeek(dom, domIndex, span, store_item) {
  const { start, end } = store_item;
  const { duration, sliced_length, rest_length } = getDuration(start, end);

  // add a week row exceeded day count
  if (start.getDay() + duration > DAYS_FULL_LENGTH) {
    span.style.width = `calc(100% * ${sliced_length})`;
    dom.appendChild(span);
    makeFakeDom(domIndex, sliced_length);
    renderAdditionalLabel(store_item, sliced_length, rest_length);
  } else {
    // a week row in day count
    span.style.width = `calc(100% * ${duration}`;
    dom.appendChild(span);
    makeFakeDom(domIndex, duration);
  }
}

function renderAdditionalLabel(store_item, sliced_length, rest_length) {
  const { currentYear } = factoryDate(current);
  const { start, content, color } = store_item;
  const REST_DATE_POSITION = new Date(
    currentYear,
    start.getMonth(),
    start.getDate() + sliced_length
  ).toDateString();

  document.querySelectorAll(".date").forEach((dom, index) => {
    if (REST_DATE_POSITION === dom.dataset.date) {
      const span = document.createElement("span");
      span.innerHTML = content;
      span.classList.add(color === "red" ? "red" : "blue");
      span.style.width = `calc(100% * ${rest_length}`;
      dom.appendChild(span);
      makeFakeDom(index, rest_length);
    }
  });
}

function makeFakeDom(domIndex, duration = 0) {
  for (let i = 1; i < duration; i++) {
    const date = document.querySelector(
      `.date:nth-of-type(${domIndex + 1 + i})`
    );
    const fake = document.createElement("span");
    fake.classList.add("fake");
    if (date != null) {
      date.appendChild(fake);
    }
  }
}

(function init() {
  renderCalendar(current);
  renderLabel(parsedStorage);
})();

document.querySelector(".clear").addEventListener("click", function () {
  localStorage.clear();
  window.location.reload();
});
