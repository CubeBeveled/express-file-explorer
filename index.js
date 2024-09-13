// Required packages
const express = require("express");
const color = require("colors");
const fs = require("fs"); // Package included with nodejs to read and write files (fs: abbreviation for file system)

const app = express();

const port = 3000; // Webserver port

app.use(express.static(__dirname + "/public")); // Server files from this folder
app.set("case sensitive routing", true)

app.listen(port, () => { console.log(color.green(`Server is running on port ${port}`)) });

app.get("/{*path}", async (req, res) => {
  let folderPath = ""
  if (req.params.path) {
    for (const i of req.params.path) {
      folderPath = folderPath + "/" + i
    }
  } else folderPath = ""

  if (folderPath == "") console.log(color.gray("Requested"), "/")
  else console.log(color.gray("Requested"), folderPath)

  const files = await getContents("public/files" + folderPath)
    .catch((err) => {
      return { err: err };
    });

  let fileElements = [];

  if (files.err) {
    console.log(files.err)
    res.status(500).send("Error reading the directory.");
  } else {
    for (const i of files) {
      if (i.type == "file") {
        fileElements.push(
          `<div class="file-container">
            <a href="/files${folderPath}/${i.name}" class="file">
              <img src="/assets/icons/${getIcon(i.name)}" class="icon">
              ${i.name}
            </a>
            <a href="/files${folderPath}/${i.name}" class="file" download>
              <button class="button">Download</button>
            </a>
          </div>`
        )
      } else if (i.type == "dir") {
        fileElements.push(
          `<div class="file-container">
            <a href="${folderPath}/${i.name}" class="file">
              <img src="/assets/icons/folder.svg" class="icon">
              ${i.name}
            </a>
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
        <link rel="stylesheet" type="text/css" href="/assets/styles.css"/>
        <title>Files</title>
      </head>
      <body>
        ${fileElements.join("")}
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
  const fileSplit = fileName.split(".")
  const fileExtension = fileSplit[fileSplit.length - 1]

  const fileExtensions = {
    text: [
      "txt",
      "asc",
    ],
    textMedia: [
      "docx",
      "doc",
      "wps",
      "pdf",
      "pages",
      "rtf",
      "md"
    ],
    code: [
      "js",
      "ts",
      "py",
      "html",
      "css",
      "lua",
      "go",
      "java",
      "c",
      "cpp",
      "h",
      "php",
      "sql",
      "ipy"
    ],
    disk: [
      "dmg",
      "iso"
    ],
    config: [
      "dat",
      "dll",
      "editorconfig",
      "eslintrc",
      "conf"
    ],
    data: [
      "log",
      "csv",
      "json",
      "sqlite",
      "db"
    ],
    archive: [
      "tar",
      "gz",
      "bz2",
      "zip",
      "rar"
    ],
    book: [
      "epub",
      "azw3",
      "cbz"
    ],
    email: [
      "eml",
      "msg"
    ],
    video: [
      "mp4",
      "m4v",
      "m4p",
      "mkv",
      "mpv",
      "mp2",
      "mpg",
      "mpeg",
      "mov",
      "qt",
      "avi",
      "wmv",
      "flv",
      "swf",
      "avchd",
      "3gp",
      "mpe"
    ],
    images: [
      "png",
      "jpg",
      "jpeg",
      "webp",
      "gif",
      "png",
      "tiff",
      "bmp",
      "tmp",
      "eps",
      "svg",
      "psd",
      "raw",
      "ai"
    ],
    subtitles: [
      "srt",
      "890",
      "cip",
      "pac",
      "scc",
      "sub",
      "xml",
      "vtt",
      "edl",
      "stl"
    ],
    sound: [
      "ogg",
      "asf",
      "aiff",
      "flac",
      "alac",
      "mid",
      "midi",
      "aac",
      "acc",
      "mp3",
      "ac3",
      "mp2",
      "vqf",
      "qt",
      "waf",
      "wav",
      "ra",
      "pcm",
      "cda",
      "wma"
    ]
  }

  if (fileExtensions.text.some(ext => ext == fileExtension)) {
    return "text.svg"
  } else if (fileExtensions.textMedia.some(ext => ext == fileExtension)) {
    return "textmedia.svg"
  } else if (fileExtensions.code.some(ext => ext == fileExtension)) {
    return "code.svg"
  } else if (fileExtensions.disk.some(ext => ext == fileExtension)) {
    return "disk.svg"
  } else if (fileExtensions.config.some(ext => ext == fileExtension)) {
    return "config.svg"
  } else if (fileExtensions.data.some(ext => ext == fileExtension)) {
    return "data.svg"
  } else if (fileExtensions.archive.some(ext => ext == fileExtension)) {
    return "archive.svg"
  } else if (fileExtensions.book.some(ext => ext == fileExtension)) {
    return "book.svg"
  } else if (fileExtensions.email.some(ext => ext == fileExtension)) {
    return "email.svg"
  } else if (fileExtensions.video.some(ext => ext == fileExtension)) {
    return "video.svg"
  } else if (fileExtensions.images.some(ext => ext == fileExtension)) {
    return "image.svg"
  } else if (fileExtensions.subtitles.some(ext => ext == fileExtension)) {
    return "subtitles.svg"
  } else if (fileExtensions.sound.some(ext => ext == fileExtension)) {
    return "sound.svg"
  } else {
    console.log(color.yellow("File extension not recognized:"), fileExtension)
    return "file.svg"
  }
}