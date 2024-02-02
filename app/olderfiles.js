let _files_current = undefined

let _files_cleanName = (name) => {
  return name.replace(/(?<!^)[\/|\s]{2,}/g, "/").replace(/^[\/\s]+|[\/\s]+$|(?<=\/)(\s+?)(?=\/)/g, "")
}

let _files_cleaned = () => {
  let newer = {}
  for (let [key, value] of Object.entries(files)) {
    newer[_files_cleanName(key)] = value
  }
  files = newer
  return files
}

let _files_sort = (toSort, by, reversed) => {
  if (Object.keys(toSort).length <= 1) return toSort
  switch (by) {
    case "name": {
      return Object.entries(toSort).map((a, b) => {
        return [_files_cleanName(a[0]), a[1]]
      }).sort((a, b) => {
        if (a[0] < b[0]) return (!reversed ? -1 : 1)
        else if (a[0] > b[0]) return (!reversed ? 1 : -1)
        else return 0
      }).reduce((r, [k, v]) => {
        if (Array.isArray(r)) {
          r = {
            [r[0]]: r[1]
          }
        }
        return {
          ...r, [k]: v
        }
      })
      break
    }
    case "created": {
      return Object.entries(toSort).sort(([, a], [, b]) => {
        return (!reversed) ? a.created - b.created : b.created - a.created
      }).reduce((r, [k, v]) => {
        if (Array.isArray(r)) r = {
          [r[0]]: r[1]
        }
        return {
          ...r, [k]: v
        }
      })
      break
    }
    case "lastEdited": {
      return Object.entries(toSort).sort(([, a], [, b]) => {
        return (!reversed) ? a.lastEdited - b.lastEdited : b.lastEdited - a.lastEdited
      }).reduce((r, [k, v]) => {
        if (Array.isArray(r)) r = {
          [r[0]]: r[1]
        }
        return {
          ...r,
          [k]: v
        }
      })
      break
    }
  }
}

let _files_toTree = (thing) => {
  let answer = {}
  for (let [key, value] of Object.entries(thing)) {
    let split = _files_cleanName(key).split("/")
    let prev = answer
    for (let i in split) {
      if (Number(i) + 1 != split.length) prev[split[i]] = prev[split[i]] || {}
      else prev[split[i]] = value
      prev = prev[split[i]]
    }
  }
  return answer
}

let _files_select = (name) => {
  _name = _files_cleanName
  _files_cleaned()
  _files_current = name
  ui.id("textarea").value = files[name].content
  if (ui.q(".selected")) ui.q(".selected").classList.remove("selected")
  ui.id(`FILE:${name}`).classList.add("selected")
  translate("en", "CURRENT_FILE")
}

let _files_makeTree = (target, parent, isChild) => {
  let tree = _files_toTree(target)
  const place = parent ? document.getElementById(`FOLDER:${parent}`).querySelector("div") : document.getElementById("sidebar-files")
  if (!isChild) place.innerHTML = ""
  for (let [key, value] of Object.entries(tree)) {    
    if (value.content) {
      place.append(ui.create("button", {
        classList: "button--file",
        id: parent ? `FILE:${parent}/${key}` : `FILE:${key}`,
        onclick: () => {
          _files_select
          _files_select(parent ? `${parent}/${key}` : key)
        }
      }, [
        ui.create("saco-icon", {name: "file"}),
        key
      ]))
    } else {
      place.append(ui.create("div", {
        classList: "folder",
        id: parent ? `FOLDER:${parent}/${key}` : `FOLDER:${key}`
      }, [
        ui.create("button", {
          classList: "button--file",
          onclick: () => {
            ui.id(parent ? `FOLDER:${parent}/${key}` : `FOLDER:${key}`).classList.toggle("closed")
          }
        }, [
          ui.create("saco-icon", {name: "arrow.caret.down"}),
          key
        ]),
        ui.create("div")
      ]))
      
      _files_makeTree(value, parent ? `${parent}/${key}` : key, true)
    }
  }
}

let _files_refresh = (sortBy = "name") => {
  _files_makeTree(_files_toTree(_files_sort(files, sortBy)))
}