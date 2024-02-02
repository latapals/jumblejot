const _translations_strings = {
  VERSION: {
    "*": () => {return version.join(".")}
  },
  CMDK_DELETE_FILE: {
    "en-GB": () => `Delete ${files.extensions.clean(files.current.name)}`
  },
  CMDK_DELETE_FILE_SYNONYMS: {
    "en-GB": "remove rubbish trash explode incinerate kill murder destroy eat devour"
  },
  CMDK_DUPLICATE_FILE: {
    "en-GB": () => `Duplicate ${files.extensions.clean(files.current.name)}`
  },
  CMDK_DUPLICATE_FILE_SYNONYMS: {
    "en-GB": "another same dupe double copy mirror"
  },
  CMDK_FETCH_FILE: {
    "en-GB": "Fetch a file from the internet"
  },
  CMDK_FETCH_FILE_SYNONYMS: {
    "en-GB": "import transfer internet net online uri https server api"
  },
  CMDK_NEW_FILE: {
    "en-GB": "New file"
  },
  CMDK_NEW_FILE_SYNONYMS: {
    "en-GB": "make build"
  },
  CMDK_RENAME_FILE: {
    "en-GB": () => `Rename ${files.extensions.clean(files.current.name)}`
  },
  CMDK_RENAME_FILE_SYNONYMS: {
    "en-GB": "new file name filename"
  },
  CMDK_UPLOAD_FILE: {
    "en-GB": "Upload a file"
  },
  CMDK_UPLOAD_FILE_SYNONYMS: {
    "en-GB": "import transfer"
  },
  CMDK_UPLOAD_FOLDER: {
    "en-GB": "Upload a folder"
  },
  CMDK_UPLOAD_FOLDER_SYNONYMS: {
    "en-GB": "import transfer"
  },
  CURRENT_FILE: {
    "*": () => {
      if (files.current.name) return files.extensions.clean(zz.sanitise(files.current.name.includes("/") ? files.current.name.slice(files.current.name.lastIndexOf("/")).slice(1) : files.current.name))
      else return "<i>No file selected.</i>"
    }
  },
  CURRENT_PAGE: {
    "*": () => {
      return workspace.current.name || "<i>There's nothing here.</i>"
    }
  },
  SETTINGS_SHORTCUTS: {
    "en-GB": "Shortcuts"
  },
  SETTINGS_LANGUAGE: {
    "en-GB": "Language"
  },
  SETTINGS_LANGUAGES_TIME_FORMAT_24_HOUR: {
    "en-GB": "24-hour time"
  },
  SIDEBAR_VIEW_ALL: {
    "en-GB": "All files",
    "es-ES": "Todos los archivos"
  },
  SIDEBAR_VIEW_FAVOURITES: {
    "en-GB": "Favourites",
    "es-ES": "Archivos favoritos"
  }, 
  SIDEBAR_VIEW_TODO: {
    "en-GB": "To-do"
  }
}

let getTranslation = (lang, specific) => {
  let translation = (_translations_strings[specific]) ? _translations_strings[specific][lang] || _translations_strings[specific]["*"] : undefined
  if (typeof translation == "function") translation = translation(), lang = "*"
  return translation
}

let translate = (lang, specific) => {
  let target = specific ? document.querySelectorAll(`[data-translation=${specific}]`) : document.querySelectorAll("[data-translation]")
  for (let i of target) {
    let translation = (_translations_strings[i.dataset.translation]) ? _translations_strings[i.dataset.translation][lang] || _translations_strings[i.dataset.translation]["*"] : undefined
    let langToGet = lang
    if (typeof translation == "function") translation = translation(), langToGet = "*"
    if (_translations_strings[i.dataset.translation]) {
      i.innerHTML = translation || (langToGet != "*" ? `${i.dataset.translation}[${langToGet}]` : i.dataset.translation)
      if (!translation) console.warn(`${i.innerHTML} is missing.`)
    } else {
      i.innerHTML = i.dataset.translation
      console.warn(`${i.dataset.translation} doesn't exist.`)
    }
  }
}

let _translations_observer = new MutationObserver((mutations) => {
  for (let mutation of mutations) {
    for (let added of mutation.addedNodes) {
    	if (!(added instanceof HTMLElement)) continue
      if (added.matches("[data-translation]")) translate(settings.data.language.locale)
    }
  }
})

window.addEventListener("load", () => {
  translate(settings.data.language.locale)
	_translations_observer.observe(document.body, {childList: true, subtree: true})
})