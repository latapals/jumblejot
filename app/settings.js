let settings = {
  pages: {}
}

settings.validator = {
  get(target, key) {
    const data = JSON.parse(localStorage.getItem("settings") || "{}")
    if (typeof target[key] == "object" && target[key] != null) return new Proxy(data[key] || target[key], settings.validator)
    else return data[key] || target[key]
  },
  set (target, key, value) {
    const data = JSON.parse(localStorage.getItem("settings") || "{}")
    target[key] = value || target[key]
    localStorage.setItem("settings", JSON.stringify(settings.data))
    return data[key] || target[key]
  }
}

settings.data = new Proxy({
  behaviours: {
    autoRefresh: false,
    colonEmoji: true,
    tabSize: 2,
    textOverflow: "wrap"
  },
  customThemes: [
    {type: "css", content: "https://jumblejot.spdblx.repl.co/app/themes/dawn.css"},
    {type: "maker", content: {
      name: "My theme"
    }}
  ],
  display: {
    animations: true,
    theme: {
      custom: {},
      mode: "light"
    }
  },
  defaults: {},
  extensions: {},
  language: {
    dictionary: ["Aetinx", "amogus"],
    locale: "en-GB"
  },
  sidebar: {
    sorting: {
      by: "lastEdited",
      reversed: true
    }
  }
}, settings.validator)

Array.from(zz.id("settingsPages").children).forEach(page => {
  page.classList.add("settingsPage")
  settings.pages[page.id.split("settingsPages-")[1]] = page
})

let flags = new Proxy({
  photopea_integration: 0,
  klecks_integration: 0,
  session_porting: 2,
  party_mode: 1
}, {
  get(target, prop) {
    const data = JSON.parse(localStorage.getItem("flags") || "{}")
    return data[prop] || target[prop]
  },
  set(target, prop, newer) {
    const data = JSON.parse(localStorage.getItem("flags") || "{}")
    data[prop] = newer || target[prop]
    localStorage.setItem("flags", JSON.stringify(data))
  }
})