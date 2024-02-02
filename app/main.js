var version = [0, 3, 0]

if (location.protocol == "http:") location.protocol = "https:"
navigator.serviceWorker.register("/sw.js")
  .then(reg => console.log("Service Worker registered.", reg))
  .catch(err => console.error("Service Worker failed to register.", err))

math.validate = expression => {
  try {
    let answer = math.evaluate(expression)
    return answer
  } catch (err) {
    return undefined
  }
}

files.load()

zz.q("[id^=t-]", null, true).forEach(item => item.style.display = null)//"none")
document.oncontextmenu = (event) => {
  event.preventDefault()
  zz.q("[id^='FILE:']", null, true).forEach(item => {
    if (event.target == item || item.contains(event.target)) {
      console.log(item.id.split("FILE:")[1])
    }
  })
}

window.addEventListener("keyup", event => {
  //zz.q("[id^=t-]", null, true).forEach(item => item.style.display = null)//"none")
})

window.addEventListener("keydown", event => {
  if (event.key == "Tab") {
    document.body.classList.add("using-tab")
  }
  //zz.q("[id^=t-]", null, true).forEach(item => item.style.display = (event.key == "z" && event.altKey) ? null:null)// : "none")
})

window.addEventListener("mousedown", event => {
  document.body.classList.remove("using-tab")
})

zz.id("nav-sidebar").onclick = () => zz.id("sidebar").classList.toggle("closed")

zz.id("sidebar-new").onclick = () => {
  let modal = zz.id("dialog-create-file")
  modal.showModal()
  modal.onsubmit = () => {
    let ans = zz.q("[data-for=name]", modal).value
    if (ans) files.new(ans, "")
  }
  let notValid = () => (files.clean.name(zz.q("[data-for=name]", modal).value) == "" || files.data[zz.q("[data-for=name]", modal).value])
  zz.q("[data-for=name]", modal).value = ""
  zz.q("[data-for=name]", modal).oninput = () => zz.q("[data-for=submit", modal).disabled = notValid()
  zz.q("[data-for=submit]", modal).disabled = true
  zz.q("[data-for=cancel]", modal).onclick = () => closeModal(modal)
}

zz.id("t-rename").onclick = () => {
  let modal = zz.id("dialog-rename")
  modal.showModal()
  modal.onsubmit = () => {
    let ans = zz.q("[data-for=name]", modal).value
    if (ans) files.rename(files.current.name, ans)
  }
  let notValid = () => (files.clean.name(zz.q("[data-for=name]", modal).value) == "" || files.data[zz.q("[data-for=name]", modal).value])
  zz.q("[data-for=name]", modal).value = files.current.name
  zz.q("[data-for=name]", modal).oninput = () => zz.q("[data-for=submit]", modal).disabled = notValid()
  zz.q("[data-for=submit]", modal).disabled = true
  zz.q("[data-for=cancel]", modal).onclick = () => closeModal(modal)
}

zz.id("t-duplicate").onclick = () => {
  files.duplicate(files.current.name)
}

zz.id("t-delete").onclick = () => {
  let modal = zz.id("dialog-delete-file")
  modal.showModal()
  modal.onsubmit = () => {
    files.delete(files.current.name)
  }
  zz.q("[data-for=name]", modal).innerText = files.current.name
  zz.q("[data-for=cancel]", modal).onclick = () => closeModal(modal)
}

zz.id("t-export").onclick = () => {
  let link = zz.create("a", {
    download: files.current.name,
    href: URL.createObjectURL(new Blob([files.data[files.current.name].content], {
      type: (files.extensions.to(files.extensions.get(files.current.name)) || {}).mode || "text/plain"
    }))
  })
  link.click()
}

zz.id("t-settings").onclick = () => {
  files.current.name = undefined
  workspace.current.name = getTranslation(settings.language, "SETTINGS_LANGUAGE")
  workspace.set(settings.pages.language)
  translate("en", "CURRENT_PAGE")
  if (zz.q(".button--file.selected")) zz.q(".button--file.selected").classList.remove("selected")
}

zz.id("nav-share").onclick = () => {
  let data = {
    files: [files.toFile(files.current.name)]
  }
  if (navigator.canShare(data)) {
    navigator.share(data)
  } else {
    console.warn("oops")
  }
}

let savedUploadForms = []
zz.q("form", zz.id("dialog-upload"), true).forEach(item => savedUploadForms.push(item.cloneNode(true)))

zz.id("t-upload").onclick = async () => {
  let modal = zz.id("dialog-upload")
  modal.showModal()
  let curr = 0
  let show = (no, first) => {
    if (!first && !modal.classList.contains("out")) {
      modal.classList.add("out")
      setTimeout(() => {
        if (modal.classList.contains("out")) {
          for (let i in [... modal.children]) modal.children[i].style.display = (i == no) ? null : "none"
          modal.classList.remove("out")
        } else if (modal.classList.contains("in")) {
          modal.classList.remove("in")
        }
      }, 500)
    } else {
      for (let i in [... modal.children]) modal.children[i].style.display = (i == no) ? null : "none"
      modal.classList.remove("out")
    }
    if (no == 0) {
      zz.q("[data-for=next]", modal).onclick = async (event) => {
        event.preventDefault()
        if (zz.q(":checked", modal).value == "web") {
          show(++no)
        } else {
          await files.upload(zz.q(":checked", modal).value)
          closeModal(modal)
        }
      }
      zz.q("[data-for=cancel]", modal).onclick = () => closeModal(modal)
    } else if (no == 1) {
      zz.q("[data-for=url]", modal).oninput = () => zz.q("[data-for=submit]", modal).disabled = zz.q("[data-for=url]", modal).value == ""
      zz.q("[data-for=submit]", modal).onclick = async (event) => {
        event.preventDefault()
        try {
          await files.upload("web", {url: zz.q("[data-for=url]", modal).value})
          closeModal(modal)
        } catch (err) {
          alert("We can't fetch that.")
        }
      }
      zz.q("[data-for=back]", modal).onclick = () => show(--no)
    }
    curr = no 
  }
  zz.q("[data-for=next]", modal).disabled = true
  zz.q("[data-for=submit]", modal).disabled = true
  zz.q("*", modal, true).forEach(item => {
  	if (!item.matches("[type=radio]")) item.value = null
    item.checked = false
  })
  zz.q("input", modal, true).forEach(item => {
    item.onchange = () => zz.q("[data-for=next]", modal).disabled = false
  })
  show(0, true)
}

let closeModal = (modal) => {
  modal.close()
  if (modal.classList.contains("out")) modal.classList.remove("out")
  modal.classList.add("closing")
  setTimeout(() => {
    modal.classList.remove("closing")
    modal.close()
  }, 500)
}

zz.q("dialog", null, true).forEach(modal => {
  modal.addEventListener("submit", () => {
    event.preventDefault()
    closeModal(modal)
  })
  modal.addEventListener("cancel", () => {
    event.preventDefault()
    closeModal(modal)
  })
  modal.onclick = event => {
    if (event.target == modal) closeModal(modal)
  }
})