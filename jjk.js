// Handle Ctrl + K
addEventListener("keydown", event => {
  if (event.key == "k" && event.ctrlKey && !event.shiftKey && !event.altKey) {
    event.preventDefault()
    window.parent.focus()
    window.parent.postMessage({
      type: "cmdk"
    }, "*")
  }
})