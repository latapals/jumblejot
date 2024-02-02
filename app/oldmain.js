var version = [0, 3, 0];
var consoleTagStyle = "border:1px solid #17f;border-radius:4px;padding:0 .5em;color:#17f;";

if (location.protocol != "https:") location.protocol = "https:";
navigator.serviceWorker.register("/sw.js").then((registration) => console.log("%cService Worker", consoleTagStyle, "Service worker registered!", registration)).catch((err) => console.warn("%cService Worker", consoleTagStyle, "Service worker failed to register.", err));

var sel = (query) => { return document.querySelector(query) }

// Files
var files = {
  alphabetise: (object) => {
    let sorted = {};
    for (let key of Object.keys(object).sort((a, b) => {
      return a.toLowerCase().localeCompare(b.toLowerCase());
    })) {
      if (typeof object[key] == "object") sorted[key] = files.alphabetise(object[key]);
      else sorted[key] = object[key];
    }
    return sorted;
  },
  current: undefined,
  data: {
    local: {
      "README.md": `wowies`,
      "projects/cheese.html": `yummmmmmy`,
      "logos/saco.svg": "deez nuts"
    }
  },
  generateTree: (object, parent = id.files) => {
    parent.innerHTML = "";
    for (let [key, value] of Object.entries(object)) {
      if (typeof value == "object") {
        let button = document.createElement("button");
        button.classList.add("folder");
        button.onclick = (event) => {
          if (button.classList.contains("hidden")) button.classList.remove("hidden");
          else button.classList.add("hidden");
        }
        let icon = new Icon("folder");
        let fileName = document.createElement("div");
        fileName.innerHTML = key;
        let caret = new Icon("arrow.caret.down");
        button.append(icon, fileName, caret);
        let folder = document.createElement("div");
        parent.append(button, folder);
        files.generateTree(value, folder);
      } else {
        let button = document.createElement("button");
        button.onclick = (event) => {
          console.log(key);
        }
        let icon = new Icon(files.iconMatch(key));
        let fileName = document.createElement("div");
        fileName.innerHTML = key;
        button.append(icon, fileName);
        parent.append(button);
      }
    }
  },
  iconMatch: (file) => {
    let ext = file.slice(file.lastIndexOf(".") + 1);
    let matching = {bat: "terminal", c: "c", cmd: "terminal", command: "terminal", cpp: "c.plusplus", cs: "c.sharp", css: "css", h: "c", htm: "html", html: "html", javascript: "javascript", js: "javascript", json: "json", lol: "lolcode", markdown: "markdown", md: "markdown", php: "php", py: "python", pyw: "python", rb: "ruby", rlib: "rust", rs: "rust", sh: "bash", svg: "svg", terminal: "terminal", tool: "terminal", xhtm: "html", xhtml: "html", xml: "xml"}
    return matching[ext] || "file";
  },
  makeTree: (options) => {
    if (options.alphabetise) {
      files.generateTree(files.alphabetise(files.toObject(files.normalise(files.data.local))))
    } else {
      files.generateTree(files.toObject(files.normalise(files.data.local)))
    }
  },
  normalise: (object) => {
    let fixed = {};
    for (let key of Object.keys(object)) {
      fixed[key.replace(/^\/+/g, "").replace(/\/+$/g, "").split(/\/+/mg).join("/")] = object[key];
    }
    object = fixed;
    return fixed;
  },
  select: (file) => {
    files.current = file;
    id.textarea.value = files.data.local[file];
  },
  toObject: (absolute) => {
    let object = {};
    for (let path of Object.keys(absolute)) {
      let i = 0;
      let split = path.replace(/^\/+/g, "").replace(/\/+$/g, "").split(/\/+/mg);
      split.reduce((gen, name) => {
        i++;
        return gen[name] || (name, i != split.length ? gen[name] = {} : gen[name] = absolute[path]);
      }, object);
    }
    return object;
  },
  types: {
    executable: ["htm", "html", "javascript", "js", "md", "markdown", "svg", "xhtm", "xhtml"],
    image: ["apng", "avif", "bmp", "gif", "ico", "jpeg", "jpg", "ppm", "png", "tif", "tiff", "webp"]
  }
}

// Settings
var settings = {
  theme: "light",
  customTheme: {
    base: "light",
    background: ["colour", "#ffffff"],
    accent: "#ff6699",
    fonts: {
      serif: "Inter",
      mono: "JetBrains Mono"
    },
    statuses: {
      success: "#00cc66",
      caution: "#ffcc00",
      warning: "#ff3344"
    }
  },
  input: {
    language: "en",
    tabSize: 2,
    colonEmoji: true,
    smartKeys: true,
    underline: true,
    overflow: "wrap"
  },
  preview: {
    enabled: true,
    direction: "right",
    percent: 0.5,
    refresh: true
  }
}

// Languages
var lang = {
  current: "en",
  list: {
    en: {
      aff: "https://raw.githubusercontent.com/wooorm/dictionaries/main/dictionaries/en-GB/index.aff",
      dic: "https://raw.githubusercontent.com/wooorm/dictionaries/main/dictionaries/en-GB/index.dic",
      countryCode: "GB"
    },
    es: {
      aff: "https://raw.githubusercontent.com/wooorm/dictionaries/main/dictionaries/es-MX/index.aff",
      dic: "https://raw.githubusercontent.com/wooorm/dictionaries/main/dictionaries/es-MX/index.dic",
      countryCode: "MX"
    }
  },
  emoji: {
    shorthands: {},
    getShorthands: async () => {
      let response = await fetch("https://raw.githubusercontent.com/ArkinSolomon/discord-emoji-converter/master/emojis.json");
      return response.json();
    }
  }
}

// Object of UI elements
var id = {
  contextMenu: sel("#contextMenu"),
  divider: sel("#divider"),
  files: sel("#files"),
  main: sel("main"),
  preview: sel("#preview"),
  settings: {
    main: sel("#settings"),
  },
  textarea: sel("#textarea"),
  workspace: sel("#workspace"),
  sidebar: sel("#sidebar")
}

// UI methods
var ui = {
  contextMenu: {},
  currentFile: {},
  divider: {},
  files: {},
  main: {},
  preview: {},
  settings: {},
  textarea: {},
  workspace: {
    layout: (type, config) => {
      id.workspace.innerHTML = "";
      switch (type) {
        case "new":
          break;
        case "code":
          id.workspace.style.setProperty("--percent", config.percent * 100 + "%");
          id.workspace.append(id.textarea);
          id.workspace.className = "";
          if (config.preview) {
            if (config.preview == "left" || config.preview == "right") {
              id.workspace.classList.add("row");
              if (config.preview == "left") id.workspace.classList.add("reverse");
            } else {
              id.workspace.classList.add("column");
              if (config.preview == "top") id.workspace.classList.add("reverse");
            }
            id.workspace.append(id.divider);
            id.workspace.append(id.preview);
          }
          break;
        case "settings":
          break;
      }
    }
  },
  sidebar: {}
}

// Setup
{
  let setup = async () => {
    console.log("%cFiles", consoleTagStyle, "Loading files from local storage...");
    files.data.local = JSON.parse(localStorage.getItem("files")) || files.data.local;
    
    console.log("%cSettings", consoleTagStyle, "Loading settings from local storage...");
    settings = JSON.parse(localStorage.getItem("settings")) || settings;
    
    console.log("%cLanguage", consoleTagStyle, "Fetching emoji shorthands...");
    try {
      lang.emoji.shorthands = await lang.emoji.getShorthands();
    } catch (err) {
      console.warn("%cLanguage", consoleTagStyle, "Failed to fetch emoji.");
    }

    console.log("%cFiles", consoleTagStyle, "Setting up the files...");
    files.makeTree({alphabetise: true})

    console.log("%cFiles", consoleTagStyle, "Selecting file...");
    if (files.data[0]) files.select(Object.keys(files.data)[0]);

    console.log("%cUI", consoleTagStyle, "Laying out the workspace...");
    ui.workspace.layout("code", {preview: "right"});
    
    console.log("%cSetup", consoleTagStyle, "Finished setup!");
  }
  setup();
}

// Listeners
sel("#nav-sidebar").addEventListener("click", (event) => {
  if (id.sidebar.classList.contains("MINIMISED")) {
    id.sidebar.classList.remove("MINIMISED")
  } else {
    id.sidebar.classList.add("MINIMISED")
  }
});