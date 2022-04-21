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
  // saveLabels 함수는 로컬스토리지에 저장하는 함수입니다.
  localStorage.setItem("calendar", JSON.stringify(parsedLabels));
}

DATES.addEventListener("click", injectDialog);
function injectDialog(e) {
  // injectDialog 함수는 이벤트 타겟으로 데이터셋을 받아서 타이틀을 넣어 그려주는 함수입니다.
  const { date: TITLE } = e.target.dataset;
  document.querySelector(".overlay").classList.add("active");
  document.querySelector("h3").innerHTML = `${TITLE.split(" ")[0]}, ${
    TITLE.split(" ")[2]
  } ${TITLE.split(" ")[1]}`;
  eventTitle = TITLE;
}

SUBMIT.addEventListener("click", onSubmit);
function onSubmit(e) {
  // 서브밋 함수는 이벤트 타이틀 값과 인풋, 피커, 카운터 값을 받아서
  // 캘린더에 선언 되어있는 로컬스토리지에 객체 형태로 푸시를 해주는 함수입니다.
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
  // 다이얼로그를 닫는 함수 입니다. 돔은 css와 클래스로 조작 하였습니다.
  document.querySelector(".overlay").classList.remove("active");
}
