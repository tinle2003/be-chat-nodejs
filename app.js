const express = require("express");
const bodyParser = require("body-parser");
var cors = require("cors");
const config = require("config");
const glob = require("glob");
const path = require("path");
const sequelize = require("./sequelizes");

var port = config.get("site.port");
var app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("views", __dirname + "/public");
app.set("view engine", "ejs");

app.use("/assets", express.static(__dirname + "/public"));

glob(`${__dirname}/apps/controllers/*`, {}, (err, files) => {
  if (err) {
    throw err;
  }
  if (files) {
    files.map((data) => {
      let apis = data.split(path.sep).pop();
      //   console.log(apis)
      app.use(`/api/${apis}`, require(data));
    });
  }
});

sequelize
  .syncAll()
  .then(() => {
    app.listen(port, () => {
      console.log(`Start server ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
