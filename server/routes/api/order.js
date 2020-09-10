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

/* POST order food.  */
//메뉴 주문
router.post("/food", function (req, res, next) {
  console.log("EXPRESS :API order food REQ");
  const post = req.body;
  //JSON Parse
  const order = JSON.parse(post);
  //value from client
  const server = order[0].server;
  const tableNO = order[1].tableNO;
  const totalPrice = order[2].totalPrice;
  //order 리스트 뽑기
  const orderList = []; //order[3][0];
  for (let i in order[3]) {
    orderList.push(order[3][i]);
  }
  const status = order[4].status;
  const order_InTime = order[5].order_InTime;

  //console logs
  /*  console.log(order);
  console.log(server);
  console.log(tableNO);
  console.log(totalPrice);
  console.log(order_InTime);
  console.log(status);
  console.log(orderList); */

  let newOrder = new Order({
    server: server,
    tableNO: tableNO,
    totalPrice: totalPrice,
    order_InTime: order_InTime.date + " : " + order_InTime.time,
    cooked_InTime: "",
    paid_InTime: "",
    status: status,
    orderList: orderList,
  });

  newOrder
    .save()
    .then((Order) => {
      /* console.log(Order); */
      res.json({ message: "Save Order Requset Successfully", status: 2 });
    })
    .catch((err) => {
      console.log(err);
      res.json({
        message: "Order Requset was not Created Successfully",
        status: 91,
        err: err,
      });
    });
});
/* GET order List.  */
//메뉴 주문 내역 조회
router.get("/list", function (req, res, next) {
  console.log("EXPRESS :API orderlist REQ");
  Order.find({ status: 1 }) //{ $gt: 0, $lt: 3 }
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
