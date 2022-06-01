document.querySelector(".prev").addEventListener("click", function () {
  current = new Date(current.getFullYear(), current.getMonth() - 1);
  renderCalendar(current);
  renderLabel(JSON.parse(saved_labels));
});

document.querySelector(".next").addEventListener("click", function () {
  current = new Date(current.getFullYear(), current.getMonth() + 1);
  renderCalendar(current);
  renderLabel(JSON.parse(saved_labels));
});
