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
