import CodeMirror from "https://cdn.jsdelivr.net/npm/codemirror@6.0.1/+esm" 

import { basicSetup, EditorView } from "https://cdn.jsdelivr.net/npm/codemirror@6.0.1/+esm"
import { javascript } from "https://cdn.jsdelivr.net/npm/@codemirror/lang-javascript@6.1.7/+esm"

let editors = {
  get: mimeType => {
    const match = mimeType.match(/^(?<type>[a-zA-Z]+)(\/(?<subtype>[a-zA-Z0-9\-\.\+]+))?$/)
    const { type, subtype } = match.groups

    if (type == "image") {
      if (subtype == "svg" || subtype == "svg+xml") return "vector"
      else return "Can't open images."
    }

    if (type == "video") {
      return "no videos"
    }

    if (type == "application") {
      if (subtype == "vnd.latapals.playground") return "yay swings!"
    }

    let editor = CodeMirror(null, {
      mode: mimeType || "text",
      lineNumbers: true,
      lineWrapping: true,
      indentUnit: 2,
      foldGutter: true,
      gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
      value: "deez nuts lmfaooooooooooo", // CHANGE THIS
      autoRefresh: true,
      viewportMargin: Infinity
    })

    /*
    let editor = new EditorView({
      doc: "console.log('hello')\n",
      extensions: [basicSetup, javascript()],
      parent: document.body
    })*/
    
    
    return editor
  }
}

export { editors }