// Required packages
const express = require("express");
const color = require("colors");
const fs = require("fs"); // Package included with nodejs to read and write files (fs: abbreviation for file system)

const app = express();

const port = 3000; // Webserver port

app.use(express.static(__dirname + "/public")); // Server files from this folder
app.set("case sensitive routing", true)

app.listen(port, () => { console.log(color.green(`Server is running on port ${port}`)) });

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
              <img src="assets/icons/${getIcon(i.name)}" class="icon">
              ${i.name}
            </a>
            <a href="files/${i.name}" class="file" download>
              <button class="button">Download</button>
            </a>
          </div>`
        )
      } else if (i.type == "dir") {
        finalList.push(
          `<div class="file-container">
            <img src="assets/icons/folder.svg" class="icon">
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

// Function to get the contents of a folder
function getContents(directoryPath) {
  return new Promise((resolve, reject) => {
    fs.readdir(directoryPath, { withFileTypes: true }, (err, entries) => {
      if (err) {
        reject(err);
      } else {
        let result = [];

        entries.forEach(async (entry) => {
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

function getIcon(fileName) {
  fileName = fileName.toLowerCase();

  if (
    fileName.endsWith(".txt") ||
    fileName.endsWith(".asc") ||
    fileName.endsWith(".log")
  ) {
    return "text.svg"
  } else if (
    fileName.endsWith(".docx") ||
    fileName.endsWith(".doc") ||
    fileName.endsWith(".wps") ||
    fileName.endsWith(".pdf") ||
    fileName.endsWith(".pages") ||
    fileName.endsWith(".rtf") ||
    fileName.endsWith(".md")
  ) {
    return "textmedia.svg"
  } else if (
    fileName.endsWith(".js") ||
    fileName.endsWith(".ts") ||
    fileName.endsWith(".py") ||
    fileName.endsWith(".html") ||
    fileName.endsWith(".css") ||
    fileName.endsWith(".lua") ||
    fileName.endsWith(".go") ||
    fileName.endsWith(".java") ||
    fileName.endsWith(".c") ||
    fileName.endsWith(".cpp") ||
    fileName.endsWith(".h") ||
    fileName.endsWith(".ipynb")
  ) {
    return "code.svg"
  } else if (
    fileName.endsWith(".tar") ||
    fileName.endsWith(".gz") ||
    fileName.endsWith(".bz2") ||
    fileName.endsWith(".zip") ||
    fileName.endsWith(".rar")
  ) {
    return "archive.svg"
  } else if (
    fileName.endsWith(".epub") ||
    fileName.endsWith(".azw3") ||
    fileName.endsWith(".cbz")
  ) {
    return "book.svg"
  } else if (
    fileName.endsWith(".eml") ||
    fileName.endsWith(".msg")
  ) {
    return "email.svg"
  } else if (
    fileName.endsWith(".mp4") ||
    fileName.endsWith(".m4v") ||
    fileName.endsWith(".m4p") ||
    fileName.endsWith(".mkv") ||
    fileName.endsWith(".mpv") ||
    fileName.endsWith(".mp2") ||
    fileName.endsWith(".mpg") ||
    fileName.endsWith(".mpeg") ||
    fileName.endsWith(".mov") ||
    fileName.endsWith(".qt") ||
    fileName.endsWith(".avi") ||
    fileName.endsWith(".wmv") ||
    fileName.endsWith(".flv") ||
    fileName.endsWith(".swf") ||
    fileName.endsWith(".avchd") ||
    fileName.endsWith(".3gp") ||
    fileName.endsWith(".mpe")
  ) {
    return "video.svg"
  } else if (
    fileName.endsWith(".srt") ||
    fileName.endsWith(".890") ||
    fileName.endsWith(".cip") ||
    fileName.endsWith(".pac") ||
    fileName.endsWith(".scc") ||
    fileName.endsWith(".sub") ||
    fileName.endsWith(".xml") ||
    fileName.endsWith(".vtt") ||
    fileName.endsWith(".edl") ||
    fileName.endsWith(".stl")
  ) {
    return "subtitles.svg"
  } else if (
    fileName.endsWith(".ogg") ||
    fileName.endsWith(".asf") ||
    fileName.endsWith(".aiff") ||
    fileName.endsWith(".flac") ||
    fileName.endsWith(".alac") ||
    fileName.endsWith(".mid") ||
    fileName.endsWith(".midi") ||
    fileName.endsWith(".aac") ||
    fileName.endsWith(".acc") ||
    fileName.endsWith(".mp3") ||
    fileName.endsWith(".ac3") ||
    fileName.endsWith(".mp2") ||
    fileName.endsWith(".vqf") ||
    fileName.endsWith(".qt") ||
    fileName.endsWith(".waf") ||
    fileName.endsWith(".wav") ||
    fileName.endsWith(".ra") ||
    fileName.endsWith(".pcm") ||
    fileName.endsWith(".wma")
  ) {
    return "sound.svg"
  } else {
    console.log(color.yellow("File format not recognized:"), fileName.split(".")[1])
    return "file.svg"
  }
}