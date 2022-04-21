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
  const OBJ_CONTENT = {
    name: eventTitle,
    content: INPUT.value,
    color: PICKER.value,
    count: COUNTER.value,
  };
  parsedLabels.push(OBJ_CONTENT);
  INPUT.value = "";
  saveLabel();
  window.location.reload();
}

CLOSE.addEventListener("click", onclose);
function onclose() {
  document.querySelector(".overlay").classList.remove("active");
}
