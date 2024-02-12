const express = require("express");
const path = require("path");
const fs = require("fs")
const app = express();

const port = 25217;

app.use(express.static(__dirname + "/Public")); // Serve static files from the root directory

app.listen(port, () => { console.log("\x1b[32m", `Server is running on port ${port}`) });

app.get("/", (req, res) => {
  fs.readdir("Public/Files", (err, files) => {
    if (err) {
      return res.status(500).send("Error reading the directory.");
    }

    const fileList = files.map(
      file => `<div class="file-container"><a href="Files/${file}" class="file"><img src="fileimg.png" class="file-img">${file}</a><a href="Files/${file}" class="file" download><button class="button">Download</button></a></div>`
    ).join("");

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" type="text/css" href="styles.css"/>
        <title>Files</title>
      </head>
      <body>
        ${fileList}
      </body>
      </html>
    `;

    res.send(html);
  });
});