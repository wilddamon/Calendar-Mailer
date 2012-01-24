
window.onload = init;

function init() {
  var selectAllButton = document.getElementById("select_all_button");
  if (selectAllButton) {
    selectAllButton.onclick = selectAllCalendars;
  }
  var selectNoneButton = document.getElementById("select_none_button");
  if (selectNoneButton) {
    selectNoneButton.onclick = deselectAllCalendars;
  }
}

function selectAllCalendars() {
  selectAll(true);
}

function deselectAllCalendars() {
  selectAll(false);
}

function selectAll(select) {
  var selectBox = document.getElementById("calendars");
  for (var i = 0; i < selectBox.options.length; i++) {
    selectBox.options[i].selected = select;
  }
  selectBox.focus();
}
