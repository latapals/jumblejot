let cmdk = {
  actions: {
    "DELETE_FILE": {
      action: () => zz.id("t-delete").click(),
      condition: () => files.current.name != undefined,
      icon: "rubbishBin"
    },
    "DUPLICATE_FILE": {
      action: () => zz.id("t-duplicate").click(),
      condition: () => files.current.name != undefined,
      icon: "copy"
    },
    "FETCH_FILE": {
      action: () => alert('cock'),
      icon: "globe"
    },
    "NEW_FILE": {
      action: () => zz.id("sidebar-new").click(),
      icon: "plus"
    },
    "RENAME_FILE": {
      action: () => zz.id("t-rename").click(),
      condition: () => files.current.name != undefined,
      icon: "rename"
    },
    "UPLOAD_FILE": {
      action: () => alert('cock'),
      icon: "import"
    },
    "UPLOAD_FOLDER": {
      action: () => alert('cock'),
      icon: "import"
    }
  },
  close: () => {
    closeModal(cmdk.element)
  },
  element: zz.id("cmdk"),
  filter: () => {
    let inThis = 0
    cmdk.sections.files.buttons.forEach(item => {
      let exists = item.name.toUpperCase().indexOf(cmdk.search.value.toUpperCase()) > -1
      item.element.style.display = exists ? null : "none"
      if (exists) inThis++
    })
    cmdk.sections.files.element.style.display = cmdk.sections.files.header.style.display = (inThis < 1) ? "none" : null

    inThis = 0
    cmdk.sections.actions.buttons.forEach(item => {
      let exists = item.element.dataset.name.toUpperCase().indexOf(cmdk.search.value.toUpperCase()) > -1
      {
        let s = [getTranslation(settings.data.language.locale, `${item.element.dataset.name}_SYNONYMS`).toUpperCase().split(" "), cmdk.search.value.toUpperCase().split(" ")]
        for (let i in s[0]) {
          for (let i2 in s[1]) {
            if (s[0][i].includes(s[1][i2]) && s[1][i2].length > 2 || s[1][i2] == s[0][i]) {
              exists = true
            }
          }
        }
      }

      if (item.source.hasOwnProperty("condition")) {
        if (!item.source.condition()) exists = false
      }
      
      item.element.style.display = exists ? null : "none"
      if (exists) inThis++
    })
    cmdk.sections.actions.element.style.display = cmdk.sections.actions.header.style.display = (inThis < 1) ? "none" : null

    inThis = 0
    cmdk.sections.maths.element.innerHTML = ""
    let equation = math.validate(cmdk.search.value.replaceAll("metre", "meter"))
    if (equation) {
      if (equation.type == "ResultSet") {
        equation.entries.forEach(item => {
          cmdk.sections.maths.element.append(zz.create("div", {
            classList: "cmdk-main-button",
            onclick: () => {
              navigator.clipboard.writeText(item)
                .catch((err)=>{alert(`Copy failed!\n\${err}`)})
              cmdk.close()
            }
          }, [item]))
          inThis++
        })
      } else if (typeof equation != "function" && typeof equation != "undefined") {
        console.log(equation)
        equation = math.format(equation, 100).replaceAll("meter", "metre")
        equation = equation.value ? equation.value : equation
        let fraction
        try {
          fraction = math.format(math.fraction(cmdk.search.value.replaceAll(" ", "")))
          if (cmdk.search.value == fraction || fraction.endsWith("/1")) fraction = undefined
        } catch (err) {}
        cmdk.sections.maths.element.append(zz.create("div", {
          classList: "cmdk-main-button",
          onclick: () => {
            navigator.clipboard.writeText(equation)
              .catch((err)=>{alert(`Copy failed!\n\${err}`)})
            cmdk.close()
          }
        }, [equation]))
        if (fraction) {
          cmdk.sections.maths.element.append(zz.create("div", {
            classList: "cmdk-main-button",
            onclick: () => {
              navigator.clipboard.writeText(fraction)
                .catch((err)=>{alert(`Copy failed!\n\${err}`)})
              cmdk.close()
            }
          }, [fraction]))
        }
        inThis++
      }
    }
    try {
      if (typeof equation == "function" || (math.parse(cmdk.search.value).name && math.parse(cmdk.search.value).name.length == 1 && cmdk.search.value.includes("="))) {
        cmdk.sections.maths.element.append(zz.create("div", {
          classList: "cmdk-main-button cmdk-sections-maths-normal",
          onclick: () => {
            let name = `${Date.now()}.desmos`
            if (files.data[name]) files.select(name)
            else {
              files.new(name, "")
              editors.data[name].editor.setExpression({id: "ans", latex: cmdk.search.value})
            }
            cmdk.close()
          }
        }, [new Icon("brand.desmos"), "Create a graph"]))
        inThis++
      }
    } catch (err) {}
    cmdk.sections.maths.element.style.display = cmdk.sections.maths.header.style.display = (inThis < 1) ? "none" : null

    zz.q(".cmdk-main-noResults").style.display = (zz.id("cmdk-sections-files").style.display == "none" && zz.id("cmdk-sections-actions").style.display == "none" && zz.id("cmdk-sections-maths").style.display == "none") ? "flex" : null

    let shown = []
    zz.q(".cmdk-main-button", null, true).forEach(item => {
      if (item.style.display != "none") shown.push(item)
    })
    if (shown.length > 0) cmdk.selectButton(shown[0])
    else files.selectedButton = undefined

    zz.q(".cmdk-main-button", null, true).forEach(button => {
      button.onmouseover = () => {
        cmdk.selectButton(button)
      }
    })
  },
  generate: () => {
    for (let [key, value] of Object.entries(cmdk.sections)) {
      cmdk.sections[key].buttons = []
    }
    
    zz.id("cmdk-sections-files").innerHTML = ""
    for (let [key, value] of Object.entries(files.sort(files.data, "name"))) {
      let icon = "file"
      try {
        icon = files.extensions.to(files.extensions.get(key.toLowerCase())).icon
      } catch (err) {}
      let button = zz.create("div", {
        classList: "cmdk-main-button",
        onclick: () => {
          files.select(key)
          cmdk.close()
        }
      }, [new Icon(icon), files.extensions.clean(key)])
      cmdk.sections.files.element.append(button)
      cmdk.sections.files.buttons.push({
        element: button,
        name: key,
        source: value
      })
    }

    cmdk.sections.actions.element.innerHTML = ""
    for (let [key, value] of Object.entries(cmdk.actions)) {
      let button = zz.create("div", {
        classList: "cmdk-main-button",
        dataset: {
          name: `CMDK_${key}`
        },
        onclick: () => {
          value.action()
          cmdk.close()
        }
      }, [new Icon(value.icon), zz.create("span", {
        dataset: {
          translation: `CMDK_${key}`
        }
      })])
      cmdk.sections.actions.element.append(button)
      cmdk.sections.actions.buttons.push({
        element: button,
        source: value
      })
    }
    translate(settings.data.language.locale)

    cmdk.filter()
  },
  open: () => {
    if (cmdk.element.open) return
    cmdk.selectedButton = undefined
    cmdk.search.value = ""
    cmdk.generate()
    cmdk.element.showModal()
    zz.id("cmdk-main").scrollTop = 0
  },
  search: zz.id("cmdk-input"),
  sections: {
    actions: {
      buttons: [],
      element: zz.id("cmdk-sections-actions"),
      header: zz.id("cmdk-sections-actions-header")
    },
    files: {
      buttons: [],
      element: zz.id("cmdk-sections-files"),
      header: zz.id("cmdk-sections-files-header")
    },
    maths: {
      buttons: [],
      element: zz.id("cmdk-sections-maths"),
      header: zz.id("cmdk-sections-maths-header")
    }
  },
  selectButton: (button, fromKeyDown) => {
    if (cmdk.selectedButton) cmdk.selectedButton.classList.remove("selected")
    cmdk.selectedButton = button
    cmdk.selectedButton.classList.add("selected")
    if (fromKeyDown) cmdk.selectedButton.scrollIntoView({behavior: "auto", block: "center", inline: "nearest"})
  }
}

zz.q("input", cmdk.element).oninput = () => {
  cmdk.filter()
  zz.id("cmdk-main").scrollTop = 0
}

addEventListener("keydown", event => {
  if (!cmdk.element.open) return

  let shown = []
  let before, after
  zz.q(".cmdk-main-button", null, true).forEach(item => {
    if (item.style.display != "none") shown.push(item)
  })
  for (let i = 0; i < shown.length; i++) {
    if (shown[i] == cmdk.selectedButton) {
      if (i > 0) before = shown[i - 1]
      if (i != shown.length - 1) after = shown[i + 1]
      break
    }
  }
  
  if (event.key == "ArrowUp") {
    event.preventDefault()
    if (before) cmdk.selectButton(before, true)
  }
  
  if (event.key == "ArrowDown") {
    event.preventDefault()
    if (after) cmdk.selectButton(after, true)
  }

  if (event.key == "Enter") {
    event.preventDefault()
    if (cmdk.selectedButton) cmdk.selectedButton.click()
  }
})

window.addEventListener("message", event => {
  let data = event.data
  if (data.type == "cmdk") {
    document.body.focus()
    cmdk.open()
  }
})