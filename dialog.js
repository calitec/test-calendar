// ### 다이얼로그 ###
const INPUT = document.querySelector(".input");
const PICKER = document.querySelector("#picker");
const COUNTER = document.querySelector("#count");
const SUBMIT = document.querySelector(".submit");
const CLOSE = document.querySelector(".close");
const DATES = document.querySelector(".dates");
let parsedLabels = JSON.parse(SAVED_LABELS) || [];
let eventTitle = "";

function saveLabel() {
  localStorage.setItem("calendar", JSON.stringify(parsedLabels));
}

DATES.addEventListener("click", injectDialog);
function injectDialog(e) {
  const { date: TITLE } = e.target.dataset;
  document.querySelector(".overlay").classList.add("active");
  document.querySelector("h3").innerHTML = `${TITLE.split(" ")[0]}, ${
    TITLE.split(" ")[2]
  } ${TITLE.split(" ")[1]}`;
  eventTitle = TITLE;
}

SUBMIT.addEventListener("click", onSubmit);
function onSubmit(e) {
  e.preventDefault();
  if (!INPUT.value) return alert("내용을 입력 해주세요.");
  const START = new Date(eventTitle);
  const END = new Date(eventTitle);
  END.setDate(END.getDate() + COUNTER.value);

  const OBJ_CONTENT = {
    name: eventTitle,
    content: INPUT.value,
    color: PICKER.value,
    start: START,
    end: END,
    count: COUNTER.value,
  };
  parsedLabels.push(OBJ_CONTENT);
  sortedEvent(parsedLabels);

  INPUT.value = "";
  saveLabel();
  window.location.reload();
}

function sortedEvent(storage) {
  const priorityQueue = (e1, e2) => {
    if (new Date(e1.start) == new Date(e2.start)) {
      return new Date(e2.end) - new Date(e1.end);
    }
    return new Date(e1.start) - new Date(e2.start);
  };
  const STORE = storage.sort((a, b) => priorityQueue(a, b));
  return STORE;
}

CLOSE.addEventListener("click", onclose);
function onclose() {
  document.querySelector(".overlay").classList.remove("active");
}
