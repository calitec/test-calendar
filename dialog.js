// ### dialog ###
const INPUT = document.querySelector(".input");
const PICKER = document.querySelector("#picker");
const COUNTER = document.querySelector("#count");
const SUBMIT = document.querySelector(".submit");
const CLOSE = document.querySelector(".close");
const DATES = document.querySelector(".dates");
let parsedLabels = JSON.parse(saved_labels) ?? []; // initialize
let thisDate = "";

function sortedLabels(storage) {
  // storage: parsed array
  return storage.sort((e1, e2) => {
    if (Number(new Date(e1.start)) == Number(new Date(e2.start))) {
      return new Date(e2.end) - new Date(e1.end);
    }
    return new Date(e1.start) - new Date(e2.start);
  });
}

function saveLabel() {
  sortedLabels(parsedLabels);
  localStorage.setItem("calendar", JSON.stringify(parsedLabels));
  saved_labels = JSON.stringify(parsedLabels);
  renderCalendar(current);
  renderLabel(parsedLabels);
}

function injectDialog(e) {
  const { date: TITLE } = e.target.dataset;
  document.querySelector(".overlay").classList.add("active");
  document.querySelector("h3").innerHTML = `${TITLE.split(" ")[0]}, ${
    TITLE.split(" ")[2]
  } ${TITLE.split(" ")[1]}`;
  thisDate = TITLE;

  const unsubscribe = () => {
    DATES.removeEventListener("click", injectDialog);
  };
  return unsubscribe;
}

function onSubmit(e) {
  e.preventDefault();
  if (!INPUT.value) return alert("내용을 입력 해주세요.");
  const START = new Date(thisDate);
  const END = new Date(thisDate);
  END.setDate(END.getDate() + Number(COUNTER.value));

  const DATA_ITEM_FORMAT = {
    content: INPUT.value,
    start: START,
    end: END,
    color: PICKER.value,
  };

  parsedLabels.push(DATA_ITEM_FORMAT);
  saveLabel();
  PICKER.value = "red";
  COUNTER.value = "1";
  INPUT.value = "";
  onClose();

  const unsubscribe = () => {
    SUBMIT.removeEventListener("click", onSubmit);
  };
  return unsubscribe;
}

function onClose() {
  document.querySelector(".overlay").classList.remove("active");
  const unsubscribe = () => {
    CLOSE.removeEventListener("click", onClose);
  };
  return unsubscribe;
}

DATES.addEventListener("click", injectDialog);
SUBMIT.addEventListener("click", onSubmit);
CLOSE.addEventListener("click", onClose);
