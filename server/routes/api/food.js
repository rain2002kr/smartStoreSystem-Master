const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
//프로미스 중첩에 빠지지 않도록 도와줌
mongoose.Promise = global.Promise;
let User = require("../../models/users");
let Food = require("../../models/foods");
let Order = require("../../models/OrderList.js");

const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage2 = multer.diskStorage({
  // 서버에 저장할 폴더
  destination: function (req, file, cb) {
    cb(null, "public/images/"); // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
  },
  // 서버에 저장할 파일 명
  filename: function (req, file, cb) {
    cb(null, file.originalname); // cb 콜백함수를 통해 전송된 파일 이름 설정
    //ext: file.mimetype.split('/')[1] 추가로 테스트해볼것
  },
});

const upload2 = multer({ storage: storage2 });

/* POST food regiest.  */
//upload2.single("img")
router.post("/regist", function (req, res, next) {
  console.log("api food regist");
  const post = req.body;
  //JSON Parse
  const food = JSON.parse(post);
  //value from client
  const name = food.name;
  const price = food.price;
  const type = food.type;
  let imgPath = food.img;
  //const image = fs.readFileSync(imgPath);
  const status = food.status;
  console.log(food);
  console.log(imgPath);

  console.log("Food is added");
  let newFood = new Food({
    name: food.name,
    price: food.price,
    type: food.type,
  });

  /* newFood.image.data = image;
  newFood.image.contentType = "image/png"; */

  newFood
    .save()
    .then((food) => {
      console.log(food);
      res.json({ message: "food Added Successfully", status: 2 });
    })
    .catch((err) => {
      console.log(err);
      res.json({
        message: "food was not Created Successfully",
        status: 91,
        err: err,
      });
    });
});

router.get("/list", function (req, res, next) {
  console.log("api foodlist");
  Food.find()
    .then((result) => {
      /* console.log(result); */
      res.json(result);
    })
    .catch((err) => {
      console.log("error");
      console.log(err);
    });
});

module.exports = router;
