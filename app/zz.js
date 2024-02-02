let zz = {
  attr: (thing, query) => thing.getAttribute(query),
  create: (tagName, options, children) => {
    let element = document.createElement(tagName)
    if (options) zz.set(element, options)
    if (children) {
      if (Array.isArray(children)) for (let i in children) element.append(children[i])
      else element.append(children)
    }
    return element
  },
  htd: string => new DOMParser().parseFromString(string, "text/html").body,
  id: name => document.getElementById(name),
  merge: (from, to, modify) => {
    let ans = modify ? from : {... from}
    Object.keys(to).forEach(item => {
      if (typeof to[item] == "object") zz.merge(ans[item], to[item], true)
      else ans[item] = to[item] || ans[item]
    })
    return ans
  },
  name: (name, element, all) => {
    if (!name) return
    if (!element) element = document
    return all ? element.querySelectorAll(`[name=${name}]`) : element.querySelector(`[name=${name}]`)
  },
  randstr: (len, charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890") => {
    let string = "", charlist = [...new Intl.Segmenter("en", {granularity: "grapheme"}).segment(charset.normalize("NFC"))].map(({segment})=>segment)
    for (let i = 0; i < len; i++) string += charlist[Math.floor(Math.random() * charlist.length)]
    return string.normalize("NFC")
  },
  sanitise: string => string.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;"),
  set: (element, options) => {
  	for (let attr of Object.keys(options)) {
      if (typeof options[attr] == "object") zz.set(element[attr], options[attr])
      else element[attr] = options[attr]
    }
  },
  try: item => {
    let ans;
    try {
      ans = item
    } catch (err) {
      ans = undefined
    }
    return ans
  },
  q: (query, element, all) => {
    if (!query) return
    if (!element) element = document
    return all ? element.querySelectorAll(query) : element.querySelector(query)
  }
}