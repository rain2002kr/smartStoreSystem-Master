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

/* POST cooked finish.  */
//음식 조리완료 //Cooked
router.post("/finish", function (req, res, next) {
  console.log("EXPRESS :API cooked finish REQ");
  const post = req.body;
  //JSON Parse
  const cooked = JSON.parse(post);
  //value from client
  const index = cooked.index;
  const id = cooked.id;
  const cooked_InTime = cooked.date;
  /* console.log(cooked.date);
  console.log(cooked_InTime.date);
  console.log(cooked_InTime.time); */

  Order.findOneAndUpdate({ _id: id }, { status: 2 })
    .updateOne({
      cooked_InTime: cooked_InTime.date + " : " + cooked_InTime.time,
    })
    .then((result) => {
      console.log(result);
      res.json({ message: "Cooked Requset Successfully", status: 2 });
    })
    .catch((err) => {
      console.log("error");
      console.log(err);
      res.json({
        message: "Cooked Requset was not Updated Successfully",
        status: 91,
        err: err,
      });
    });
});

/* GET cooked List.  */
//메뉴 주문 내역 조회
router.get("/list", function (req, res, next) {
  console.log("EXPRESS :API cooked list REQ");
  Order.find({ status: 2 }) //{ $gt: 0, $lt: 3 }
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
