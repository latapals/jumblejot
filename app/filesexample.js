let files = {
  "folder/file": {
    content: "This is the content of the folder",
    created: 1662996404656,
    favourited: true,
    lastEdited: 1662996404656,
    tags: ["new"]
  },
  "folder/balls.txt": {
    content: "Balls",
    created: 1662996404656,
    favourited: false,
    lastEdited: 1662996404656,
    origin: "https://saco.dev/balls.txt",
    tags: ["balls"]
  }
}

/*
favourites = Object.keys(files)
  .filter((key) => files[key].favourited)
  .reduce((obj, key) => {
      return Object.assign(obj, {
        [key]: a[key]
      });
}, {})
*/