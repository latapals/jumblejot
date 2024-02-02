class ThreeEditor extends HTMLElement {
  constructor() {
    super()

    this.value = {
      html: "",
      css: "",
      js: "",
      libraries: {
        css: [],
        js: []
      }
    }

    let def = {
      lineNumbers: true,
      lineWrapping: true,
      indentUnit: 2,
      foldGutter: true,
      gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
    }

    this.selected = ["html"]

    this.load = () => {
      this.editors = {
        html: CodeMirror(null, {
          mode: "text/html",
          ... def,
          value: this.value.html,
          htmlMode: true
        }),
        css: CodeMirror(null, {
          mode: "css",
          ... def,
          value: this.value.css
        }),
        js: CodeMirror(null, {
          mode: "javascript",
          ... def,
          value: this.value.js
        }),
        libraries: CodeMirror(null, {
          mode: "application/ld+json",
          ... def,
          value: JSON.stringify(this.value.libraries, 0, 2)
        })
      }

      for (let [key, value] of Object.entries(this.editors)) {
        value.on("change", () => {
          this.value[key] = (key == "libraries") ? JSON.parse(value.getValue()) : value.getValue()
          this.save()
        })
        value.on("focus", () => value.refresh())
      }
    }
    this.load()

    this.bar = zz.create("nav", null, [
      zz.create("span", null, [
        zz.create("button", {
          dataset: {for: "html"},
          onclick: () => this.set(["html"], event.ctrlKey)
        }, [new Icon("html"), "HTML"]),
        zz.create("button", {
          dataset: {for: "css"},
          onclick: () => this.set(["css"], event.ctrlKey)
        }, [new Icon("css"), "CSS"]),
        zz.create("button", {
          dataset: {for: "js"},
          onclick: () => this.set(["js"], event.ctrlKey)
        }, [new Icon("javascript"), "JavaScript"]),
        zz.create("button", {
          dataset: {for: "libraries"},
          onclick: () => this.set(["libraries"], event.ctrlKey)
        }, [new Icon("package"), "Libraries"])
      ]),
      zz.create("span", null, [
        zz.create("button", {
          onclick: () => this.update()
        }, [new Icon("play"), "Run"]),
        zz.create("button", {
          onclick: () => this.preview.openInNewTab()
        }, [new Icon("open"), "Preview in a new tab"]),
        zz.create("button", {
          dataset: {for: "fullscreen"},
          onclick: () => {
            this.classList.toggle("fullscreen")
            zz.q("[data-for=fullscreen] saco-icon", this).name = this.classList.contains("fullscreen") ? "arrow.in" : "arrow.out"
            Array.from(this.editors).forEach(item => editor.refresh())
          }
        }, [new Icon("arrow.out")]),
      ])
    ])

    this.workspace = zz.create("section", {
      classList: "three-editors"
    })

    this.workspace.addEventListener("keydown", (event) => {
      if (event.key == "Enter" && event.ctrlKey) {
        if (event.shiftKey) this.preview.openInNewTab()
        else this.update()
      }
    })

    this.preview = zz.create("iframe", {
      srcdoc: `
Click the run button or press Ctrl/Cmd + Enter.
<style>
  body {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100vw;
    padding: 0;
    margin: 0;
  }
</style>
`,
      openInNewTab: () => {
        if (this.preview.tab) this.preview.tab.close()
        this.preview.tab = window.open()
        this.preview.tab.document.title = "cock" || files.current.name
        this.preview.tab.document.documentElement.innerHTML = this.preview.srcdoc
        zz.q("link, script", this.preview.tab.document.documentElement, true).forEach(item => {
          let newer = zz.create("script")
          Array.from(item.attributes).forEach(attr => newer.setAttribute(attr.name, attr.value))
          newer.appendChild(this.preview.tab.document.createTextNode(item.innerHTML))
          item.parentNode.replaceChild(newer, item)
        })
      }
    })

    this.update = () => {
      this.preview.srcdoc =
        `<head>
        	<style>${this.value.css || ""}<\/style>
          ${this.value.libraries.css.reduce((prev, current) => `${prev}<link href="${current}" rel="stylesheet" />`, "")}
          ${this.value.libraries.js.reduce((prev, current) => `${prev}<script src="${current}" defer><\/script>`, "")}
        </head>
        <body>${this.value.html || ""}</body><script src="https://jumblejot.spdblx.repl.co/jjk.js"><\/script><script>${this.value.js || ""}<\/script>`
    }

    this.save = () => {
      files.set(files.current.name, JSON.stringify(this.value))
      files.save()
    }

    this.append()

    this.set = (to = this.selected, toggle) => {
      this.workspace.innerHTML = ""
      if (toggle) {
        to.forEach(item => {
          if (this.selected.includes(item)) {
            if (this.selected.length > 1) this.selected.splice(this.selected.indexOf(item), 1)
          }
          else this.selected = [...this.selected, item]
        })
      } else {
        this.selected = to
      }
      this.selected.forEach(item => {
        let editor = this.editors[item]
        this.workspace.append(editor.getWrapperElement())
        editor.refresh()
      })
      if (this.selected.length == 0) this.workspace.append("There's nothing here.")
      zz.q("button.selected", this.bar, true).forEach(button => button.classList.remove("selected"))
      zz.q("button[data-for]", this.bar, true).forEach(button => {
        if (this.selected.includes(button.dataset.for)) button.classList.add("selected")
      })
    }
  }

  connectedCallback () {
    this.append(this.bar, this.workspace, this.preview)
    this.set()
    this.update()
  }
}

customElements.define("three-editor", ThreeEditor)