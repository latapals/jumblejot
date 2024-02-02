let version = [0, 4, 0]

const get = url => import(url).then(m => { for (let [k, v] of Object.entries(m)) { window[k] = v } })

get("./storage.js")
.then(() => {
  initDB().then(() => lw())
})

get("./editors.js")

export default ""

window.t = () => {
  let main = zz.q("main")
  let isMini = main.classList.toggle("minimised")
  zz.id("toggle-sidebar-icon").name = isMini ? "pin" : "arrow.caret.left"
  if (isMini) {
    zz.id("sidebar-holder").style.display = "none"
    setTimeout(()=>zz.id("sidebar-holder").style.display = null, 100)
  }
}

window.lw = async () => {
  let select = zz.id`sidebar-workspaces`
  while (select.firstChild) {
    select.removeChild(select.firstChild)
  }
  let workspacesData = await workspaces.getAll()
  workspacesData.forEach(workspace => {
    let option = zz.create("option", {
      innerText: workspace.name,
      value: workspace.id
    })
    select.append(option)
  })
  await lf(select.value)
  select.onchange = () => {
    lf(select.value)
  }
}

window.lf = async (workspaceId) => {
  let list = zz.id`sidebar-files`
  list.innerHTML = ""
  let workspaceData = await workspaces.get(workspaceId)
  workspaceData.files.forEach(file => {
    let button = zz.create("button", { classList: "button tab" }, [
      new Icon("file"), zz.create("span", { innerText: file.file.name })
    ])
    button.onclick = () => {
      console.log(file.file.type)
    }
    list.append(button)
  })
}

zz.id`toggle-sidebar`.onclick = t

/*
// Call lw() after the DOM is loaded
window.addEventListener("DOMContentLoaded", async () => {
  await lw()
})*/