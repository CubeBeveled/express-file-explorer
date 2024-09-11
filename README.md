# Express file explorer
A web file explorer made with [express.js](https://expressjs.com/)

# Required packages
* colors: Makes the console more colorful
* express: Used to host the webserver

# Installation
1. Make sure you have [`nodejs`](https://nodejs.org/) and [`npm`](https://www.npmjs.com/) installed
2. Run (in this project's folder)
```sh
npm install
```

# Running & accessing the web interface
1. To start the webserver run
```sh
npm run start
# or
node index.js
```
2. Accessing the web interface
   * If you are running this locally (on your computer) and have **not** changed the port go to http://localhost:3000
   * If you are running this on the cloud make sure the port is exposed and go to your cloud environment's ip or url

# Changing the webserver port
To change the port change the index.js variable (around line 9) that by default is 3000

# Adding files
1. Make sure the `files` folder exists in the public folder
2. Put your files there