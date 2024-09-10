const express = require("express");
const path = require("path");
const fs = require("fs")
const app = express();

const port = 3000;

app.use(express.static(__dirname + "/public")); // Serve static files from the root directory
app.set("case sensitive routing", true)

app.listen(port, () => { console.log("\x1b[32m", `Server is running on port ${port}`) });

app.get("/", async (req, res) => {
  const files = await getContents("public/files")
    .catch((err) => {
      return { err: err };
    });

  let finalList = [];

  if (files.err) {
    console.log(files.err)
    res.status(500).send("Error reading the directory.");
  } else {
    for (const i of files) {
      if (i.type == "file") {
        finalList.push(
          `<div class="file-container">
            <a href="files/${i.name}" class="file">
              <img src="assets/file.png" class="icon">
              ${i.name}
            </a>
            <a href="files/${i.name}" class="file" download>
              <button class="button">Download</button>
            </a>
          </div>`
        )
      } else {
        finalList.push(
          `<div class="file-container">
            <img src="assets/folder.png" class="icon">
            ${i.name}
          </div>`
        )
      }
    }

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" type="text/css" href="assets/styles.css"/>
        <title>Files</title>
      </head>
      <body>
        ${finalList.join("")}
      </body>
      </html>
    `;

    res.send(html);
  }
});

function isDirectory(path) {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if (err) {
        reject(err);
      } else {
        resolve(stats.isDirectory());
      }
    });
  });
}

function getContents(directoryPath) {
  return new Promise((resolve, reject) => {
    fs.readdir(directoryPath, { withFileTypes: true }, (err, entries) => {
      if (err) {
        reject(err);
      } else {
        let result = [];

        entries.forEach(async (entry) => {
          const entryPath = path.join(directoryPath, entry.name);
          // If its a directory, recursively list its contents (not anymore)
          if (entry.isDirectory()) {
            result.push({
              name: entry.name,
              type: "dir",
            });
          } else {
            result.push({
              name: entry.name,
              type: "file",
            });
          }
        });

        resolve(result);
      }
    });
  });
}