const dotenv = require('dotenv');
dotenv.config();
const express = require("express");
const cors = require("cors");
const https = require('https');
const app = express();
const fs = require('fs');
var corsOptions = {
  origin: "https://thetalkplace.com"
};
var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(function (req, res, next) {
  if(req.headers.origin !== "https://thetalkplace.com")// && req.headers.origin !== "http://localhost:3000"
    return res.send({
      status: false,
      message: "Invlaid request"
    });
  next();
});
// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to audiown application." });
});
require("./app/routes/routes.js")(app);
require("./app/routes/admin.routes.js")(app);
// set port, listen for requests
const PORT = process.env.PORT || 3235;
/*app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});*/
const key = fs.readFileSync('/etc/letsencrypt/live/thetalkplace.com/privkey.pem');
const cert = fs.readFileSync('/etc/letsencrypt/live/thetalkplace.com/fullchain.pem');
const options = {key: key, cert: cert };
https.createServer(options, app).listen(PORT);
