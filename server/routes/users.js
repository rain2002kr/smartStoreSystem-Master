var express = require("express");
var router = express.Router();
var PORT = "http://localhost:5000";
var pug = require("pug");
let User = require("../models/users");
let Order = require("../models/OrderList.js");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render("users", { title: "users", PORT: PORT });
});

router.get("/orderList", function (req, res, next) {
  Order.find()
    .then((result) => {
      console.log(result);
      //res.json(result);
      var json = result;
      res.render("orderList", { title: "orderList", PORT: PORT, json });
    })
    .catch((err) => {
      console.log("error");
      console.log(err);
    });
});

module.exports = router;
