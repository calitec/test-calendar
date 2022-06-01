function onPrev() {
  current = new Date(current.getFullYear(), current.getMonth() - 1);
  renderCalendar(current);
  renderLabel(parsedStorage);

  const unsubscribe = () => {
    document.querySelector(".prev").removeEventListener("click", onPrev);
  };
  return unsubscribe;
}

function onNext() {
  current = new Date(current.getFullYear(), current.getMonth() + 1);
  renderCalendar(current);
  renderLabel(parsedStorage);

  const unsubscribe = () => {
    document.querySelector(".next").removeEventListener("click", onNext);
  };
  return unsubscribe;
}

document.querySelector(".prev").addEventListener("click", onPrev);
document.querySelector(".next").addEventListener("click", onNext);
