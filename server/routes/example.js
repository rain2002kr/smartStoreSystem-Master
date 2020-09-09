var express = require("express");
var router = express.Router();
var PORT = "http://localhost:5000";
var pug = require("pug");
const mongoose = require("mongoose");
//프로미스 중첩에 빠지지 않도록 도와줌
mongoose.Promise = global.Promise;
var fs = require("fs");
var path = require("path");

let Image = require("../models/image");
const MongoClient = require("mongodb");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const url = "mongodb://localhost:27017/test";
const dbName = "test";

const storage = new GridFsStorage({
  url: "mongodb://localhost:27017/test",
  file: (req, file) => {
    return {
      //filename: Date.now() + 'file_' + file.originalname
      bucketName: "testB",
      filename: file.originalname,
    };
  },
});
const upload = multer({ storage: storage });

/* GET users listing. */
// Upload your files as usual

router.get("/", function (req, res, next) {
  res.render("example", { title: "users", PORT: PORT });
});
router.post("/upload", upload.single("userfile"), (req, res, next) => {
  console.log(req.file); // 콘솔(터미널)을 통해서 req.file Object 내용 확인 가능.
});

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

router.post("/upload2", upload2.single("userfile"), (req, res, next) => {
  let newImage = new Image();
  newImage.name = req.file.originalname;
  //newImage.Image = req.file;
  let imgPath = req.file.path;
  newImage.img.data = fs.readFileSync(imgPath);
  newImage.img.contentType = "image/png";

  newImage
    .save()
    .then((user) => {
      console.log(user);
      res.json({ message: "user Created Successfully" });
    })
    .catch((err) => {
      console.log(err);
      res.json({ message: "user was not Created Successfully" });
    });

  //res.send('upload success'+req.file);
  console.log(req.file); // 콘솔(터미널)을 통해서 req.file Object 내용 확인 가능.
});

router.post("/download", function (req, res, next) {
  var fileName = req.body.filename; //화면으로부터 입력값 받기
  console.log("download", fileName);

  MongoClient.connect(url, function (err, client) {
    if (err) {
      return res.render("index", {
        title: "Uploaded Error",
        message: "MongoClient Connection error",
        error: err.errMsg,
      });
    }
    const db = client.db(dbName);

    const collection = db.collection("testB.files");
    const collectionChunks = db.collection("testB.chunks");

    console.log("filename Test :", fileName);
    collection.find({ filename: fileName }).toArray(function (err, docs) {
      if (err) {
        return res.render("index", {
          title: "File error",
          message: "Error finding file",
          error: err.errMsg,
        });
        console.log("1");
      }
      if (!docs || docs.length === 0) {
        console.log("2");
        //이부분 문제였음.
        return res.render("index", {
          title: "Download Error",
          message: "No file found",
        });
      } else {
        //Retrieving the chunks from the db
        collectionChunks
          .find({ files_id: docs[0]._id })
          .sort({ n: 1 })
          .toArray(function (err, chunks) {
            if (err) {
              console.log("3");
              return res.render("index", {
                title: "Download Error",
                message: "Error retrieving chunks",
                error: err.errmsg,
              });
            }
            if (!chunks || chunks.length === 0) {
              //No data found
              console.log("4");
              return res.render("index", {
                title: "Download Error",
                message: "No data found",
              });
            }
            //Append Chunks
            let fileData = [];
            for (let i = 0; i < chunks.length; i++) {
              //This is in Binary JSON or BSON format, which is stored
              //in fileData array in base64 endocoded string format
              fileData.push(chunks[i].data.toString("base64"));
              console.log("5");
            }

            //Display the chunks using the data URI format
            let finalFile =
              "data:" + docs[0].contentType + ";base64," + fileData.join("");
            console.log("6");
            res.render("example", {
              title: "Image File",
              message: "Image loaded from MongoDB GridFS",
              imgurl: finalFile,
            });
          });
      }
    });
  });
});

function base64_decode(base64str, file) {
  var bitmap = new Buffer.from(base64str, "base64");
  fs.writeFileSync(file, bitmap);
  console.log("****** File created from base64 decoded string ******");
}

router.post("/download2", function (req, res, next) {
  let fileName = req.body.filename2;
  console.log(fileName);

  Image.find({ name: fileName }, (err, docs) => {
    if (err) {
      console.log("error");
    } else {
      console.log("find ");
      console.log(docs[0].img);
      console.log(docs);
      var base64 = docs[0].img.data.toString("base64");
      //var bitmap = new Buffer(base64, "copy.jpg");
      var finalFile = "images/ramen.png";

      res.render("example", {
        title: "Image File",
        message: "Image loaded from MongoDB ",
        imgurl: finalFile,
      });
    }
  });
});
module.exports = router;
