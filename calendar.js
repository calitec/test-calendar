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
  // factoryDate 함수는 현재 날짜들을 미리 저장한 함수입니다.
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
  // makeMonthYearRow 함수에서는 인자를 받아와서 날짜 데이터들을 돔 문자열로 만드는 함수입니다.
  const { currentYear, currentMonth } = factoryDate(realDate);
  let yearmonth = "";
  yearmonth = `<div class="year-month"><em>${
    currentMonth + 1
  }</em> ${currentYear}</div>`;
  return { yearmonth };
}

function makeDatesRows(realDate) {
  // makeDatesRows 함수에서는 인자를 받아와서 요일, 이전, 현재, 다음 날짜들을 각각 반복문을 돌려서 돔 문자열로 만들어
  // 배열에 푸시 해주었고, result 객체로 반환 해주었습니다.
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
  // renderCalendar 함수에서는 위의 날짜를 그리는 함수들에 current를 인자로 전달하여 날짜를 생성한 뒤 html에 그려주는 함수 입니다.
  const { yearmonth } = makeMonthYearRow(realDate);
  const { days, dates } = makeDatesRows(realDate);

  TITLE_WRAPPER.innerHTML = yearmonth;
  DAYS_WRAPPER.innerHTML = days;
  DATES_WRAPPER.innerHTML = dates;
}

function renderLabel() {
  // renderLabel 함수는 라벨을 렌더링 해주는 함수입니다.
  // 필요한 데이터들이 들어있는 스토리지 객체를 미리 만든 뒤 반복문을 돌려서
  // 돔 데이터셋과 스토리지 데이터의 값이 일치하면 라벨로 렌더링을 해주었습니다.
  // 하루 스케줄은 그대로 렌더링 해주었고, 긴 스케줄의 경우, 남은 요일의 일수 만큼 잘라 렌더링 해주고,
  // 나머지 날짜는 다음 줄에 따로 렌더링 해주었습니다.
  if (SAVED_LABELS != null) {
    JSON.parse(SAVED_LABELS).forEach((storageItem) => {
      const STORAGE_OBJ = {
        // 로컬스토리지와 관련된 관심사가 비슷한 데이터들을 객체형태로 묶음.
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
            let tmp = "";
            tmp = Number(new Date(dom.dataset.date));
            if (tmp < Number(new Date(dom.dataset.date))) {
              tmp = Number(new Date(dom.dataset.date));
              makeFakeDom(index + 2, STORAGE_OBJ.count);
            } else {
              makeFakeDom(index + 3, STORAGE_OBJ.count);
            }
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
  // renderAdditionalLabel 함수는 renderLabel에서 잘려진 나머지 일수들을 렌더링하는 함수입니다.
  // 스토리지 객체, 잘려진 나머지 개수를 각각 받아서, 시작 날짜를 구한 뒤
  // 반복문을 돌려서 시작 날짜와 일치하는 돔을 찾아서, 나머지일수 만큼의 너비로 렌더링 해주었습니다.
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
  // makeFakeDom 함수는 라벨의 가짜 돔을 만들어주는 함수 입니다.
  // 긴 스케줄 데이터는 너비 값을 늘려서 구현을 해주었는데, 시작 날짜 컬럼 빼고는 형체가 없는 상태라
  // 가짜 돔을 각각 심어주어서 높이 값을 맞춰 주었습니다.
  // 긴 스케줄 데이터가 두번째 컬럼에 오는 케이스의 경우, 높이 값이 고정이라 라벨이 겹치는 버그가 발생하는데
  // 플렉스 오더 속성으로 긴 스케줄이 먼저 정렬 되도록하여 해결 하였습니다.

  for (let i = 0; i < count - 1; i++) {
    const date = document.querySelector(`.date:nth-of-type(${index + i - 1})`);
    const fake = document.createElement("div");
    if (date !== null) {
      fake.classList.add("fake");
      date.appendChild(fake);
    }
  }
}

document.querySelector(".clear").addEventListener("click", function () {
  localStorage.clear();
  window.location.reload();
});

(function init() {
  renderCalendar(current);
  renderLabel();
})();
