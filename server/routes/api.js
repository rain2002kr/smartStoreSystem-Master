var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
//프로미스 중첩에 빠지지 않도록 도와줌
mongoose.Promise = global.Promise;
let User = require("../models/users");
let Food = require("../models/foods");
let Order = require("../models/OrderList.js");

const multer = require("multer");
var fs = require("fs");
var path = require("path");

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

/* POST user sign up. */
router.post("/user/signup", function (req, res, next) {
  console.log("api user sign-up");
  var post = req.body;
  //JSON Parse
  var user = JSON.parse(post);
  //value from client
  var id = user.id;
  var name = user.name;
  var pwd = user.pwd;
  var status = user.status;

  console.log("User is added");
  let newUser = new User({ id: id, name: name, pwd: pwd });
  newUser
    .save()
    .then((user) => {
      console.log(user);
      res.json({ message: "user Created Successfully", status: 2 });
    })
    .catch((err) => {
      console.log(err);
      res.json({
        message: "user was not Created Successfully",
        status: 91,
        err: err,
      });
    });
});

/* POST user login . */
router.post("/user/login", function (req, res, next) {
  console.log("api user login");
  var post = req.body;
  //JSON Parse
  var user = JSON.parse(post);
  //value from client
  var id = user.id;
  var pwd = user.pwd;
  var status = user.status;

  console.log(post);
  console.log(JSON.parse(post));

  console.log(id);
  console.log(pwd);
  console.log(status);

  console.log("User is find");

  User.findOne({ id: id }, function (err, user) {
    if (err) return res.json({ error: err, status: 99 });
    if (!user) return res.json({ error: "user was not found", status: 91 });

    if (user) {
      User.find({ id: id })
        .then((result) => {
          for (i in result) {
            if (result[i].id === id) {
              console.log("Login try result[i].id");
              if (result[i].pwd === pwd) {
                console.log("user password is correct and login success");
                res.json({
                  id: result[i].id,
                  name: result[i].name,
                  message: "user password is correct and login success",
                  status: 2,
                });
              } else {
                console.log("user password is not correct");
                res.json({
                  message: "user password is not correct",
                  status: 92,
                });
              }
            } else if (result[i].id === null) {
              console.log("user ID is not existed");
              res.json({ message: "user ID is not existed", status: 91 });
            }
          }
        })

        .catch((err) => {
          return res.json({ error: err, status: 99 });
        });
    }
  });
});

/* POST food regiest.  */
//upload2.single("img")
router.post("/food/regist", function (req, res, next) {
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

router.get("/food/list", function (req, res, next) {
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

/* POST order food.  */
//메뉴 주문
router.post("/order/food", function (req, res, next) {
  console.log("api order food ");
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
router.get("/order/list", function (req, res, next) {
  console.log("api orderlist");
  Order.find({ status: { $gt: 0, $lt: 3 } })
    .then((result) => {
      /* console.log(result); */
      res.json(result);
    })
    .catch((err) => {
      console.log("error");
      console.log(err);
    });
});
//메뉴 주문 내역 조회
router.get("/paid/list", function (req, res, next) {
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

/* POST cooked finish.  */
//음식 조리완료 //Cooked
router.post("/cooked/finish", function (req, res, next) {
  console.log("api cooked finish ");
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

/* POST paid finish.  */
//계산완료 //Paid
router.post("/paid/finish", function (req, res, next) {
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

router.post("/user/test", function (req, res, next) {});
module.exports = router;

/* var existId = false;
    User.find().where(id).equals(id)
    .then(() => res.json({message : "user ID is existed"})
    
    );
   */
/* User.find({id:id})
    .then((result)=>{
      for(i in result){  
        console.log(result[i].id);
        if(result === null){
          console.log('Value is empty')
        }else {
          console.log('Value is exist')
          //res.json({message : "user ID is existed"})
          //return false;
        }
      }
      
    })
    .catch((err)=>{console.log('error'); console.log(err)});  */

/*   User.find().where(id).ne(id).then(() => 
    { 
      console.log('not equals Value')
      addUser();
    }); */

//var Staus = 2;
//res.send([{ "status": Staus },{ "status": Staus }]);

/* POST user sign up. */
/* router.post('/user/signup', function(req, res, next) {
  console.log('Test server signup~~~~~');
  var post = req.body;
  var id = post.id;
  var name = post.name;
  var pwd = post.pwd;
  var pwd2 = post.pwd2;
  console.log(id);
  console.log(name);
  console.log(pwd);
  console.log(pwd2);
  res.json({id:"ok"});
  res.redirect('/');
}); */
/*삭제 방법 
Order.findOneAndDelete({ _id: id })
    .then((result) => {
      console.log(result);
      //res.json(result);
    })
    .catch((err) => {
      console.log("error");
      console.log(err);
    });
  */
