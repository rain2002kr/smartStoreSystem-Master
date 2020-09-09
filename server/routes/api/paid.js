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

//메뉴 주문 내역 조회
router.get("/list", function (req, res, next) {
  console.log("api paidlist");
  Order.find({ status: { $gt: 2 } })
    .then((result) => {
      /* console.log(result); */
      res.json(result);
    })
    .catch((err) => {
      console.log("error");
      console.log(err);
    });
});

/* POST paid finish.  */
//계산완료 //Paid
router.post("/finish", function (req, res, next) {
  console.log("api paid finish ");
  const post = req.body;
  //JSON Parse
  const paid = JSON.parse(post);
  //value from client
  const index = paid.index;
  const id = paid.id;
  const paid_InTime = paid.date;
  console.log(paid);
  //console.log(paid.date);
  console.log(paid_InTime.date);
  console.log(paid_InTime.time);

  Order.findOneAndUpdate({ _id: id }, { status: 3 })
    .updateOne({
      paid_InTime: paid_InTime.date + " : " + paid_InTime.time,
    })
    .then((result) => {
      console.log(result);
      res.json({ message: "Paid Requset Successfully", status: 3 });
    })
    .catch((err) => {
      console.log("error");
      console.log(err);
      res.json({
        message: "Paid Requset was not Updated Successfully",
        status: 91,
        err: err,
      });
    });
});

module.exports = router;
