// 처음에는 투데이에 커런트를 넣어주어 렌더링하고, 네비가 작동할때마다 +-를 해주는 이벤트리스너를 작성 하였습니다.
document.querySelector(".prev").addEventListener("click", function () {
  current = new Date(current.getFullYear(), current.getMonth() - 1);
  renderCalendar(current);
  renderLabel();
});

document.querySelector(".next").addEventListener("click", function () {
  current = new Date(current.getFullYear(), current.getMonth() + 1);
  renderCalendar(current);
  renderLabel();
});
