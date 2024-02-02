window.addEventListener("keydown", event => {
  if (event.ctrlKey && event.key == "n" && !event.shiftKey) {
    event.preventDefault()
    alert('nyaaaaa')
  } else if (event.ctrlKey && event.key == "k" && !event.shiftKey && !event.altKey) {
    event.preventDefault()
    cmdk.open()
  }
})

/*
// Shortcuts
window.onkeydown = (event) => {
  if (event.key == "Tab") {
    if (finder.style.display != "none") {
      let selector = `#finder [tabindex]:not([tabindex="-1"]):not([style="display: none;"]), #finder input`;
      let focusableContent = document.querySelectorAll(selector);
      let firstFocusableElement = focusableContent[0];
      let lastFocusableElement = focusableContent[focusableContent.length - 1];
      if (event.shiftKey) {
        if (document.activeElement == firstFocusableElement) {
          event.preventDefault();
          lastFocusableElement.focus();
        }
      } else if (document.activeElement == lastFocusableElement) {
        event.preventDefault();
        firstFocusableElement.focus();
        event.preventDefault();
      }
    }
  } else if (event.ctrlKey && event.altKey && event.key == "n") {
    event.preventDefault();
    document.getElementById("new").click();
  } else if (event.ctrlKey && (event.keyCode == 192 || event.keyCode == 223)) {
    event.preventDefault();
    document.getElementById("new").click();
  } else if (event.ctrlKey && event.key == "d") {
    event.preventDefault();
    duplicateFile(currentFile);
  } else if (event.ctrlKey && event.key == "\\") {
    event.preventDefault();
    document.getElementById("rename").click();
  } else if (event.ctrlKey && event.key == "e") {
    event.preventDefault();
    document.getElementById("export").click();
  } else if (event.ctrlKey && event.shiftKey && event.keyCode == "40") {
    event.preventDefault();
    document.getElementById("export").click();
  } else if (event.ctrlKey && event.shiftKey && event.keyCode == "8" ||
    event.ctrlKey && event.shiftKey && event.keyCode == "46") {
    event.preventDefault();
    document.getElementById("delete").click();
  } else if (event.ctrlKey && event.shiftKey && event.keyCode == "8" ||
    event.ctrlKey && event.keyCode == "13") {
    event.preventDefault();
    preview.update();
    if (event.shiftKey) {
    	preview.openInNewTab();
    }
  } else if (textarea == document.activeElement && (event.ctrlKey && event.key == "z") && !event.shiftKey) {
    event.preventDefault();
    undo();
  } else if (textarea == document.activeElement && ((event.key == "Z" || event.key == "y") && event.ctrlKey)) {
    event.preventDefault();
    redo();
  } else if (event.ctrlKey && event.key == "k") {
    event.preventDefault();
    finder.open();
  } else if (event.ctrlKey && event.shiftKey && (event.which >= 49 && event.which <= 57)) {
    event.preventDefault();
    list = [];
    files.querySelectorAll("button").forEach((item) => {
      if (item.nextElementSibling) {
        if (item.nextElementSibling.tagName == "DIV") {
          return;
        }
      }
      list.push(item.id.replace("FILE:", ""))
    });
    if (event.which == 57) {
      selectFile(list[list.length - 1]);
      return true;
    }
    [1, 2, 3, 4, 5, 6, 7, 8].forEach((i) => {
      if (event.which == i + 48) {
        if (list[i - 1]) {
          selectFile(list[i - 1])
          return true;
        }
      }
    });
  } else if (event.ctrlKey && event.key == "F") {
  	byId("currentFile").click();
  }
};
*/