let editors = {
  
  create: (name, content) => {
    files.data[name].type = files.data[name].realType = files.extensions.fromName(name).type || "text"
    
    if (files.data[name].type == "integration") {
      try {
        let ext = files.extensions.get(name), defaults = settings.data.defaults
        let iframe = zz.create("iframe")
        console.log(defaults[ext].content, settings.data.extensions, settings.data.extensions[defaults[ext].content])
        fetch(settings.data.extensions[defaults[ext].content]).then(res => res.json()).then(res => {
          iframe.src = res.editor.url
  
          iframe.onload = () => {
            iframe.contentWindow.postMessage({
              type: "load",
              value: files.data[name].content
            }, "*")
          }
          
          window.addEventListener("message", event => {
            if (iframe.contentWindow != event.source) return
            let data = event.data
            if (data.type == "edited") files.set(files.current.name, data.value || "")
          })
        })
        return editors.data[name] = {
          editor: iframe,
          type: "integration",
          wrapper: iframe
        }
      } catch (err) {throw err}
      return
    }
    
    if (files.data[name].type == "desmos") {
      try {
        let maker = document.createElement("div")
        let editor = editors.data[name] = {
          editor: Desmos.GraphingCalculator(maker),
          type: "desmos",
          wrapper: maker
        }
        editor.editor.setState(JSON.parse(files.data[name].content))
        editor.editor.observeEvent("change", () => {
          files.set(files.current.name, JSON.stringify(editor.editor.getState()))
        })
        return editor
      } catch (err) {}
    }
    
    if (files.data[name].type == "tldraw") {
      try {
        throw "tldraw is not supported yet."
      } catch (err) {}
    }

    if (files.data[name].type == "three") {
      try {
        let editor = new ThreeEditor
        let parsed = JSON.parse(files.data[name].content)
        editor.value = parsed
        editor.load()
        return editors.data[name] = {
          editor: editor,
          type: "three",
          wrapper: editor
        }
      } catch (err) {
        console.trace(err)
      }
    }

    if (files.data[name].type == "jjem") {
      try {
        let iframe = zz.create("iframe", {
          src: JSON.parse(files.data[name].content).url || "about:blank"
        })

        iframe.onload = () => {
          iframe.contentWindow.postMessage({
            type: "set",
            value: JSON.parse(files.data[name].content).content
          }, '*')
        }
        
        window.addEventListener("message", event => {
          let data = event.data
        
          if (data.type == "edited") {
            files.set(files.current.name, JSON.stringify({url: "https://talking-iframes.spdblx.repl.co/iframe", content: data.value}))
          }
        })
        return editors.data[name] = {
          editor: iframe,
          type: "jjem",
          wrapper: iframe
        }
      } catch (err) {}
    }

    files.data[name].type = "text"

    let editor = CodeMirror(null, {
      mode: files.extensions.fromName(name).mode || "text",
      lineNumbers: true,
      lineWrapping: true,
      indentUnit: 2,
      foldGutter: true,
      gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
      value: content,
      autoRefresh: true,
      viewportMargin: Infinity
    })
    CodeMirror.keyMap.default["Shift-Tab"] = "indentLess"
    CodeMirror.keyMap.default["Tab"] = "indentMore"
    editor.on("change", (a, b) => files.set(files.current.name, editor.getValue()))
    editor.on("focus", () => editor.refresh())
    return editors.data[name] = {
      editor: editor,
      type: "text",
      wrapper: () => zz.create("section", {classList: "CodeMirrorWrapper"}, [
        editor.getWrapperElement()
      ])
    }
  },

  data: {}
  
}

{
  let refresh = () => {
    try {
      editors.data[files.current.name].editor.refresh()
    } catch (err) {
      console.warn(err)
    }
  }

  addEventListener("beforeprint", refresh)
  addEventListener("print", refresh)
  addEventListener("afterprint", refresh)
}