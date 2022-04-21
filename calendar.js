const APP = document.querySelector("#app");
const TITLE_WRAPPER = document.querySelector(".year-month");
const DAYS_WRAPPER = document.querySelector(".days");
const DATES_WRAPPER = document.querySelector(".dates");
const TODAY = new Date();
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const SAVED_LABELS = localStorage.getItem("calendar");
let current = TODAY;

// ### 달력 ###
function factoryDate(realDate) {
  const year = realDate.getFullYear();
  const month = realDate.getMonth();
  const date = realDate.getDate();
  return {
    currentYear: new Date(year, month, date).getFullYear(),
    currentMonth: new Date(year, month, date).getMonth(),
    currentDate: new Date(year, month, date).getDate(),
    prevLastDate: new Date(year, month, 0).getDate(),
    prevLastDay: new Date(year, month, 0).getDay(),
    thisLastDate: new Date(year, month + 1, 0).getDate(),
    thisLastDay: new Date(year, month + 1, 0).getDay(),
  };
}

function makeMonthYearRow(realDate) {
  const { currentYear, currentMonth } = factoryDate(realDate);
  let yearmonth = "";
  yearmonth = `<div class="year-month"><em>${
    currentMonth + 1
  }</em> ${currentYear}</div>`;
  return { yearmonth };
}

function makeDatesRows(realDate) {
  const {
    currentYear,
    currentMonth,
    currentDate,
    prevLastDate,
    prevLastDay,
    thisLastDate,
    thisLastDay,
  } = factoryDate(realDate);

  const fullWeeks = [];
  const fullDates = [];

  // 요일
  for (let i = 0; i < DAYS.length; i++) {
    fullWeeks.push(`
        <div>${DAYS[i]}</div>
      `);
  }

  // 이전 달 날짜
  for (let i = prevLastDate - prevLastDay; i <= prevLastDate; i++) {
    if (prevLastDay !== 6) {
      fullDates.push(`
        <div class="date prevmonth-date" data-date="${new Date(
          currentYear,
          currentMonth - 1,
          i
        ).toDateString()}">${i}</div>
      `);
    }
  }

  // 이번 달 날짜
  for (let i = 1; i <= thisLastDate; i++) {
    fullDates.push(`
        <div class="date thismonth-date" data-date="${new Date(
          currentYear,
          currentMonth,
          i
        ).toDateString()}">${i}</div>
      `);
  }

  // 다음 달 날짜
  for (let i = 1; i <= 6 - thisLastDay; i++) {
    if (thisLastDay !== 6) {
      fullDates.push(`
        <div class="date nextmonth-date" data-date="${new Date(
          currentYear,
          currentMonth + 1,
          i
        ).toDateString()}">${i}</div>
      `);
    }
  }

  const result = {
    days: fullWeeks.join(""),
    dates: fullDates.join(""),
  };

  return result;
}

function renderCalendar(realDate) {
  const { yearmonth } = makeMonthYearRow(realDate);
  const { days, dates } = makeDatesRows(realDate);

  TITLE_WRAPPER.innerHTML = yearmonth;
  DAYS_WRAPPER.innerHTML = days;
  DATES_WRAPPER.innerHTML = dates;
}

function renderLabel() {
  if (SAVED_LABELS != null) {
    JSON.parse(SAVED_LABELS).forEach((storageItem) => {
      const STORAGE_OBJ = {
        month: new Date(storageItem.name).getMonth(),
        date: new Date(storageItem.name).getDate(),
        day: new Date(storageItem.name).getDay(),
        name: storageItem.name,
        content: storageItem.content,
        color: storageItem.color,
        count: storageItem.count,
      };

      document.querySelectorAll(".date").forEach((dom, index) => {
        if (dom.dataset.date === STORAGE_OBJ.name) {
          const SPAN = document.createElement("span");
          SPAN.innerHTML = STORAGE_OBJ.content;
          SPAN.classList.add(STORAGE_OBJ.color === "red" ? "red" : "blue");

          // extra length
          if (STORAGE_OBJ.count > 1) {
            const DAYS_LENGTH = 7;
            const REST_COUNT =
              Number(STORAGE_OBJ.day) + Number(STORAGE_OBJ.count) - DAYS_LENGTH;
            const SPLITTED_COUNT = STORAGE_OBJ.count - REST_COUNT;
            SPAN.classList.add("extra");
            dom.classList.add("hasExtra");

            // limited week row
            if (
              Number(STORAGE_OBJ.day) + Number(STORAGE_OBJ.count) >
              DAYS_LENGTH
            ) {
              SPAN.style.width = `calc(100% * ${SPLITTED_COUNT})`;
              dom.appendChild(SPAN);
              // add a week row exceeded day count
              renderAdditionalLabel(STORAGE_OBJ, SPLITTED_COUNT, REST_COUNT);
            } else {
              // a week row in day count
              SPAN.style.width = `calc(100% * ${STORAGE_OBJ.count}`;
              dom.appendChild(SPAN);
            }

            makeFakeDom(index + 2, STORAGE_OBJ.count);
          } else {
            // length 1(length 1)
            dom.appendChild(SPAN);
          }
        }
      });
    });
  }
}

function renderAdditionalLabel(storage_obj, splitted_count, rest_count) {
  const { month, date, content, color } = storage_obj;
  const { currentYear } = factoryDate(current);
  const REST_START_DATES = new Date(
    currentYear,
    month,
    date + splitted_count
  ).toDateString();

  document.querySelectorAll(".date").forEach((dom) => {
    if (REST_START_DATES === dom.dataset.date) {
      const span = document.createElement("span");
      dom.classList.add("hasExtra");
      span.innerHTML = content;
      span.classList.add(color === "red" ? "red" : "blue");
      span.style.width = `calc(100% * ${rest_count}`;
      dom.appendChild(span);
    }
  });
}

function makeFakeDom(index, count = 0) {
  for (let i = 0; i < count; i++) {
    const date = document.querySelector(`.date:nth-of-type(${index + i - 1})`);
    const fake = document.createElement("div");
    if (date !== null) {
      if (date.getAttribute("class").indexOf("hasExtra") != -1) {
      } else {
        fake.classList.add("fake");
        date.appendChild(fake);
      }
    }
  }
}

document.querySelector(".clear").addEventListener("click", function () {
  localStorage.clear();
});

(function init() {
  renderCalendar(current);
  renderLabel();
})();
