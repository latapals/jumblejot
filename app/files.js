let files = {
  
  clean: {
    data: () => {
      let newer = {}
      for (let [key, value] of Object.entries(files.data)) newer[files.clean.name(key)] = value
      return files.data = newer
    },
    name: (name) => name ? name.replace(/(?<!^)[\/|\s]{2,}/g, "/").replace(/^[\/\s]+|[\/\s]+$|(?<=\/)(\s+?)(?=\/)/g, "") : name
  },
    
  current: {
    name: undefined,
    closedFolders: [],
    sort: {
      by: undefined,
      reversed: undefined
    }
  },

  data: {},
  
  delete: (name) => {
    name = Array.isArray(name) ? name : [name]
    name.forEach(item => {
      if (files.clean.data()[item]) {
        delete files.data[item]
        delete editors.data[item]
      } else {
        console.trace(`Tried to delete the file \`${item}\`, but the file does not exist.`)
      }
    })
    localStorage.setItem("files", JSON.stringify(files.data))
    files.select()
    files.refresh()
  },

  duplicate: (name) => {
    /*let index = 1, newName = () => `${name.replace(/\s\(\d+\)$/, "")
} (${index})`*/
    let index = 1, newName = () => {
      let ok = name.replaceAll(/\s\(\d+\)/g, "")
      return ok.slice(0, Math.max(0, ok.indexOf(".")) || ok.length)
      + ` (${index})`
      + ok.slice(Math.max(0, ok.indexOf(".")) || ok.length)
    }
    while (files.data[newName()]) {
      index++
    }
    files.new(newName(), files.data[name].content)
  },
  
  editors: {},
  
  extensions: {
    clean: (filename) => files.extensions.to(files.extensions.get(filename)) ? files.extensions.to(files.extensions.get(filename)).type ? filename.slice(0, filename.lastIndexOf(".")) : filename : filename,
    get: (filename = "") => filename.includes(".") ? filename.toLowerCase().slice(filename.toLowerCase().lastIndexOf(".") + 1) : "",
    fromName: (name) => files.extensions.to(files.extensions.get(name)) || {type: null},
    shareable: ["pdf", "flac", "m4a", "mp3", "oga", "ogg", "opus", "wav", "weba", "avif", "bmp", "gif", "ico", "jfif", "jpeg", "jpg", "pjp", "pjpeg", "png", "svg", "svgz", "tif", "tiff", "webp", "xbm", "css", "csv", "ehtml", "htm", "html", "shtm", "shtml", "text", "txt", "m4v", "mp4", "mpeg", "mpg", "ogm", "ogv", "webm"],
    to: (ext) => {
      if (settings.data.defaults[ext] && true) {
        return {
          icon: "package",
          type: "integration"
        }
      }
      for (let [key, value] of Object.entries(files.extensions.types)) {
        if (value.extensions.includes(ext)) return value
      }
    },
    types: {
      c: {
        extensions: ["c"],
        icon: "c",
        mode: "text/x-csrc"
      },
      cpp: {
        extensions: ["cpp"],
        icon: "c.plusplus",
        mode: "text/x-c++src"
      },
      cs: {
        extensions: ["cs"],
        icon: "c.sharp",
        mode: "text/x-csharp"
      },
      css: {
        extensions: ["css"],
        icon: "css",
        mode: "css"
      },
      desmos: {
        extensions: ["desmos"],
        icon: "brand.desmos",
        mode: "application/ld+json",
        type: "desmos"
      },
      html: {
        extensions: ["htm", "html"],
        icon: "html",
        mode: "text/html"
      },
      image: {
        extensions: ["png", "apng", "gif", "avif", "jpg", "jpeg", "tif", "tiff", "bmp", "ico", "webp"],
        icon: "image"
      },
      js: {
        extensions: ["js", "javascript"],
        icon: "javascript",
        mode: "javascript"
      },
      json: {
        extensions: ["json"],
        icon: "json",
        mode: "application/ld+json"
      },
      jsx: {
        extensions: ["jsx"],
        icon: "js",
        mode: "jsx"
      },
      lolcode: {
        extensions: ["lol"],
        icon: "lolcode"
      },
      markdown: {
        extensions: ["md", "markdown"],
        icon: "markdown",
        mode: "gfm"
      },
      php: {
        extensions: ["php"],
        icon: "php",
        mode: "application/x-httpd-php"
      },
      py: {
        extensions: ["py", "bry", "pyx"],
        icon: "python",
        mode: "text/x-python"
      },
      ruby: {
        extensions: ["rb"],
        icon: "ruby",
        mode: "text/x-ruby"
      },
      rust: {
        extensions: ["rs", "rlib"],
        icon: "rust",
        mode: "text/x-rustsrc"
      },
      shell: {
        extensions: ["sh"],
        icon: "bash",
        mode: "text/x-sh"
      },
      svg: {
        extensions: ["svg"],
        icon: "svg",
        mode: "application/xml"
      },
      three: {
        extensions: ["three"],
        icon: "bolt",
        mode: "application/ld+json",
        type: "three"
      },
      tldraw: {
        extensions: ["tldr", "tldraw"],
        icon: "brand.tldraw",
        mode: "application/ld+json",
        type: "tldraw"
      },
      todo: {
        extensions: ["checklist"],
        icon: "check.square",
        mode: "application/ld+json",
        type: "todo"
      },
      xml: {
        extensions: ["xml", "xhtml"],
        icon: "xml",
        mode: "application/xml"
      }
    },
  },
  
  generateTree: (target, parent, isChild) => {
    let tree = files.toTree(target)
    const place = parent ? document.getElementById(`FOLDER:${parent}`).querySelector("div") : document.getElementById("sidebar-files")
    if (!isChild) place.innerHTML = ""
    for (let [key, value] of Object.entries(tree)) {    
      if (value.content != undefined) {
        let icon = "file"
        try {
          icon = files.extensions.to(files.extensions.get(key.toLowerCase())).icon
        } catch (err) {}
        place.append(zz.create("button", {
          classList: "button--file",
          id: parent ? `FILE:${parent}/${key}` : `FILE:${key}`,
          onclick: () => {
            files.select((parent ? `${parent}/${key}` : key))
          }
        }, [
          zz.create("saco-icon", {name: icon}),
          zz.create("span", {}, files.extensions.clean(key))
        ]))
      } else {
        place.append(zz.create("div", {
          classList: "folder",
          id: parent ? `FOLDER:${parent}/${key}` : `FOLDER:${key}`
        }, [
          zz.create("button", {
            classList: "button--file",
            onclick: () => {
              let name = parent ? `FOLDER:${parent}/${key}` : `FOLDER:${key}`
              zz.id(name).classList.toggle("closed")
              if (files.current.closedFolders.includes(name)) files.current.closedFolders.splice(files.current.closedFolders.indexOf(name), 1)
              else files.current.closedFolders.push(name)
            }
          }, [
            zz.create("saco-icon", {name: "arrow.caret.down"}),
            zz.create("span", {}, key)
          ]),
          zz.create("div")
        ]))
        
        files.generateTree(value, parent ? `${parent}/${key}` : key, true)
      }
    }
  },

  load: () => {
    files.data = JSON.parse(localStorage.getItem("files")) || {}
    files.clean.data()
    for (let [key, value] of Object.entries(files.data)) editors.create(key, value.content)
    files.current.sort = settings.data.sidebar.sorting || {
      by: "lastEdited",
      reversed: true
    }
    files.select()
  },
  
  new: (name, content) => {
    name = files.clean.name(name)
    if (!name) return
    if (files.data[name]) return console.trace(`Tried to create the file \`${name}\`, but the file already exists.`)
    if (files.extensions.fromName(name).type == "desmos" && content == "") content = `{"version":9,"graph":{},"expressions":{"list":[]}}`
    if (files.extensions.fromName(name).type == "three" && content == "") content = JSON.stringify({"html":"","css":"","js":"","libraries":{"css":[],"js":[]}})
    files.data[name] = {
      content: content,
      created: Date.now(),
      lastEdited: Date.now(),
      type: (()=>{try{return files.extensions.to(files.extensions.get(name)).type}catch(err){}})() || "text"
    }
    editors.create(name, content)
    files.save()
    files.refresh()
    files.select(name)
  },
  
  refresh: () => {
    if (Object.keys(files.data).length > 0) files.generateTree(files.toTree(files.sort(files.data, files.current.sort.by, files.current.sort.reversed)))
    else document.getElementById("sidebar-files").innerHTML = ""
    if (files.current.name && zz.id(`FILE:${files.current.name}`)) zz.id(`FILE:${files.current.name}`).classList.add("selected")
    for (let item of files.current.closedFolders) {
      if (zz.id(item)) zz.id(item).classList.toggle("closed")
      else files.current.closedFolders.splice(files.current.closedFolders.indexOf(item), 1)
    }
  },
  
  rename: (name, newName) => {
    if (files.data[name] && files.data[newName]) {
      console.trace(`Tried to rename the file \`${name}\` to \`${newName}\` , but that file already exists.`)
    } else if (files.data[name]) {
      files.data[newName] = files.data[name]
      editors.data[newName] = editors.create(newName, files.data[name].content) //editors.data[name]
      files.data[newName].type = files.extensions.fromName(newName).type || "text"
      files.data[newName].lastEdited = Date.now()
      delete files.data[name]
      delete editors.data[name]
      if (files.current.name == name) files.select(newName)
      files.save()
    } else {
      console.trace(`Tried to rename the file \`${name}\`, but the file does not exist.`)
    }
  },

  save: () => {
    localStorage.setItem("files", JSON.stringify(files.data))
    if (!files.current.name || files.data[files.current.name].type != files.data[files.current.name].realType) {
      let older, newer
      if (files.current.name) {
        older = editors.data[files.current.name]
        newer = editors.create(files.current.name, files.data[files.current.name].content)
      }
      if (!files.current.name || older.type != newer.type) files.select(files.current.name)
    }
  },
  
  select: (name) => {
    name = name || Object.keys(files.sort(files.data, files.current.sort.by, files.current.sort.reversed))[0]
    name = files.clean.name(name)
    files.current.name = name
    if (name && editors.data[files.current.name].type != files.data[files.current.name].realType) {
      editors.create(files.current.name, files.data[files.current.name].content)
    }
    if (name && files.data[name]) {
      let wrapper = (editors.data[name].type != "text") ? editors.data[name].wrapper
        : zz.create("section", {classList: "CodeMirrorWrapper"}, [
          editors.data[name].editor.getWrapperElement()
      ])
      workspace.set(wrapper)
    } else {
      workspace.set()
    }
    let mode = ""
    try {
      mode = files.extensions.fromName(name).mode
    } catch (err) {}
    if (editors.data[name] && editors.data[name].type == "text") {
      editors.data[name].editor.setOption("mode", mode)
      editors.data[name].editor.setOption("htmlMode", files.extensions.fromName(name).mode == "text/html")
      editors.data[name].editor.refresh()
    }
    files.refresh()
    if (zz.q(".selected")) zz.q(".selected").classList.remove("selected")
    if (name && zz.id(`FILE:${name}`)) zz.id(`FILE:${name}`).classList.add("selected")
    if (files.current.name) workspace.current.name = files.extensions.clean(zz.sanitise(files.current.name.includes("/") ? files.current.name.slice(files.current.name.lastIndexOf("/")).slice(1) : files.current.name))
    else workspace.current.name = "<i>No file selected.</i>"
    translate("en", "CURRENT_FILE")
    translate("en", "CURRENT_PAGE")
    zz.id("nav-share").style.display = files.current.name ? files.extensions.shareable.includes(files.extensions.get(files.current.name)) ? null : "none" : "none"
  },
  
  set: (name, content) => {
    if (!name) return
    if (!files.data[name]) return console.trace(`Tried to edit the file \`${name}\`, but the file does not exist.`)
    files.data[name].content = content
    files.data[name].lastEdited = Date.now()
    files.save()
    files.refresh()
  },
  
  sort: (toSort, by, reversed) => {
    if (Object.keys(toSort).length <= 1) return toSort
    switch (by) {
      case "name": {
        return Object.entries(toSort).sort(([aName, a], [bName, b]) => {
          return (!reversed) ? aName.localeCompare(bName) : bName.localeCompare(aName)
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
  },

  toFile: (name) => {
    return new File([files.data[name].content], name, {
      type: (()=>{try{return files.extensions.to(files.extensions.get(name)).mode}catch(err){}})() || "text/plain"
    })
  },
  
  toTree: (flat) => {
    let answer = {}
    for (let [key, value] of Object.entries(flat)) {
      let split = files.clean.name(key).split("/")
      let prev = answer
      for (let i in split) {
        if (Number(i) + 1 != split.length) prev[split[i]] = prev[split[i]] || {}
        else prev[split[i]] = value
        prev = prev[split[i]]
      }
    }
    return answer
  },

  upload: async (type, options) => {
    return new Promise((resolve, reject) => {
      if (type == "file") {
        let input = zz.create("input", {
          type: "file",
          multiple: true,
          onchange: async (event) => {
            let read = (file) => new Promise((res, rej) => {
              let reader = new FileReader()
              reader.onload = () => res(reader.result)
              reader.readAsText(file)
            })
    
            for (let file of input.files) {
              let name = await file.name
              let value = await read(file)
              resolve(files.new(name, value))
            }
          }
        })
        input.click()
      } else if (type == "folder") {
        let input = zz.create("input", {
          type: "file",
          webkitdirectory: true,
          multiple: true,
          onchange: async (event) => {
            let read = (file) => new Promise((res, rej) => {
              let reader = new FileReader()
              reader.onload = () => res(reader.result);
              reader.readAsText(file);
            })
    
            for (let file of input.files) {
              let name = await file.webkitRelativePath;
              let value = await read(file)
              resolve(files.new(name, value))
            }
          }
        })
        input.click()
      } else if (type == "web") {
        (async () => {
        	let url = options.url
          if (!url) reject()
          let response
          try {
            response = await fetch(url)
          } catch (err) {
            reject()
            return
          }
          if (response.status == 200) {
            let data = await response.text()
            resolve(files.new(Date.now() + "." + (files.extensions.get(url) || "txt"), String(data)))
          } else {
            reject()
          }
        })()
      }
    })
  }
  
}