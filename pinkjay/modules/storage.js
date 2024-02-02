import { openDB } from "https://cdn.jsdelivr.net/npm/idb@7/+esm"
import mime from "https://cdn.skypack.dev/mime/lite"

mime.define({
  "application/vnd.latapals.playground": ["three"],
  "application/vnd.latapals.todo": ["todo"],
  "application/vnd.latapals.chatgpt": ["gptroom"],
  "application/vnd.latapals.desmos": ["desmos"]
}, {
  force: true
})

let db
const init = async () => {
  db = await openDB("workspacesDb", 1, {
    upgrade(db, oldVersion, newVersion, transaction) {
      db.createObjectStore("workspaces", { keyPath: "id" })
    }
  })
}

const workspaces = {
  create: async data => {
    const tx = db.transaction("workspaces", "readwrite")
    const workspace = zz.merge({
      created: new Date().getTime(),
      files: [],
      id: zz.randstr(36),
      name: `Workspace created at ${new Date().toLocaleString()}`
    }, data || {})
    await tx.objectStore("workspaces").put(workspace)
    return workspace
  },
  edit: async (id, data) => {
    const workspace = await tx.objectStore("workspaces").get(id) || null
    workspace = zz.merge(workspace, data)
    if (!workspace) throw `Workspace "${id}" not found. :(`
    await db.transaction("workspaces", "readwrite").objectStore("workspaces").push(workspace)
    return workspace
  },
  get: async id => {
    const tx = db.transaction("workspaces", "readwrite")
    const workspace = await tx.objectStore("workspaces").get(id) || null
    if (!workspace) throw `Workspace "${id}" not found. :(`
    return workspace
  },
  getAll: async () => {
    const tx = db.transaction("workspaces", "readwrite")
    const all = await tx.objectStore("workspaces").getAll()
    return Array.from(all)
  },
  remove: async id => {
    const tx = db.transaction("workspaces", "readwrite")
    await tx.objectStore("workspaces").delete(id)
  }
}

const files = {
  add: async (workspaceId, file) => {
    const tx = db.transaction("workspaces", "readwrite")
    const workspace = await tx.objectStore("workspaces").get(workspaceId) || null
    if (!workspace) throw `Workspace "${workspaceId}" not found. :(`

    let slot = {
      added: new Date().getTime(),
      file: file,
      id: zz.randstr(36)
    }
    workspace.files.push(slot)
  
    console.log(`File "${file.name}" added to "${workspace.name}".`)
  
    await tx.objectStore("workspaces").put(workspace)

    return slot
  },
  get: async (workspaceId, fileId) => {
    const tx = db.transaction("workspaces", "readonly");
    const workspace = await tx.objectStore("workspaces").get(workspaceId) || null
    if (!workspace) throw `Workspace "${workspaceId}" not found. :(`
  
    const file = workspace.files.find(file => file.id === fileId)
    if (!file) throw `File "${fileId}" not found in "${workspace.name}". :(`
  
    return file
  },
  remove: async (workspaceId, fileId) => {
    const tx = db.transaction("workspaces", "readwrite")
    const workspace = await tx.objectStore("workspaces").get(workspaceId) || null
    if (!workspace) throw `Workspace "${workspaceId}" not found. :(`
  
    const fileIndex = workspace.files.findIndex(file => file.id == fileId)
    if (fileIndex == -1) throw `File "${fileId}" not found in "${workspace.name}". :(`
  
    workspace.files.splice(fileIndex, 1)
  
    console.log(`File "${fileId}" removed from "${workspace.name}".`)
  
    await tx.objectStore("workspaces").put(workspace)
  },
  update: async (workspaceId, fileId, newFile) => {
    const tx = db.transaction("workspaces", "readwrite");
    const workspace = await tx.objectStore("workspaces").get(workspaceId) || null;
    if (!workspace) throw `Workspace "${workspaceId}" not found. :(`;
  
    const fileIndex = workspace.files.findIndex(file => file.id === fileId);
    if (fileIndex === -1) throw `File "${fileId}" not found in "${workspace.name}". :(`;
  
    workspace.files[fileIndex].file = newFile;
    workspace.files[fileIndex].updated = new Date().getTime();
  
    console.log(`File "${fileId}" replaced with "${newFile.name}" in "${workspace.name}".`);
  
    await tx.objectStore("workspaces").put(workspace);
  },
  upload: async workspaceId => {
    const input = zz.create("input", { type: "file" })
    input.click()
    const slot = await new Promise((resolve, reject) => {
      input.addEventListener("change", () => {
        if (input.files.length > 0) {
          const fileReader = new FileReader()
          let file = input.files[0]
          fileReader.onload = () => resolve(new File([fileReader.result], input.files[0].name, {
            type: file.type || new RegExp(/\.[A-Za-z0-9]+$/).test(file.name) ? mime.getType(file.name) : null 
          }))
          fileReader.onerror = () => reject("Failed to read file.")
          fileReader.readAsArrayBuffer(file)
        } else {
          reject(new Error("No file selected."))
        }
      })
    })
    let added = await files.add(workspaceId, slot)
    return added
  }
}

export { workspaces, files, init as initDB, mime }