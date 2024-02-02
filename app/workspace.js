let workspace = {

  current: {
    name: ""
  },

  section: zz.q("#workspace > section"),

  // This is supposed to be a normal function, not an arrow function.
  set: function () {
    workspace.section.innerHTML = ""
    for (let i of arguments) {
      workspace.section.append(i)
    }
  }
  
}