// ### dialog ###
const INPUT = document.querySelector(".input");
const PICKER = document.querySelector("#picker");
const COUNTER = document.querySelector("#count");
const SUBMIT = document.querySelector(".submit");
const CLOSE = document.querySelector(".close");
const DATES = document.querySelector(".dates");
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

function saveLabel(data_item_foramt) {
  parsedStorage.push(data_item_foramt);
  sortedLabels(parsedStorage);
  localStorage.setItem("calendar", JSON.stringify(parsedStorage));
  saved_labels = JSON.stringify(parsedStorage);
}

function injectDialog(e) {
  const { date } = e.target.dataset;
  document.querySelector(".overlay").classList.add("active");
  document.querySelector("h3").innerHTML = `${date.split(" ")[0]}, ${
    date.split(" ")[2]
  } ${date.split(" ")[1]}`;
  thisDate = date;

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

  saveLabel(DATA_ITEM_FORMAT);
  renderCalendar(current);
  renderLabel(parsedStorage);

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
