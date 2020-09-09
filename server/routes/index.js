var express = require("express");
var router = express.Router();
var PORT = "http://localhost:5000/";
let User = require("../models/users");
let Food = require("../models/foods");
let UserR = require("../models/users");

/* GET home page. */
router.get("/", function (req, res, next) {
  User.find()
    .then((result) => {
      console.log(result);
      var json = result;
      res.render("index", { title: "Express", PORT: PORT, json }); //pug 로 전송
    })
    .catch((err) => {
      console.log("error");
      console.log(err);
    });
  Food.find()
    .then((result) => {
      console.log(result);
      var json = result;
      res.render("index", { title: "Express", PORT: PORT, json: json }); //pug 로 전송
    })
    .catch((err) => {
      console.log("error");
      console.log(err);
    });
});

module.exports = router;
