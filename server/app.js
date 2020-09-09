const compression = require("compression");
const createError = require("http-errors");
const express = require("express");
const admin = require("sriracha"); //sriracha
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

//소켓 io
//const socketIO = require("socket.io");

//프로미스 중첩에 빠지지 않도록 도와줌
mongoose.Promise = global.Promise;
const apiUserRouter = require("./routes/api/user.js");
const apiFoodRouter = require("./routes/api/food.js");
const apiOrderRouter = require("./routes/api/order.js");
const apiCookedRouter = require("./routes/api/cooked.js");
const apiPaidRouter = require("./routes/api/paid.js");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const exampleRouter = require("./routes/example");

const app = express();
//socket 통신 추가
//var server = require("http").createServer(app);
//app.io = require("socket.io")(); //({ path: "/myownpath" });

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(compression());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/user", apiUserRouter);
app.use("/api/food", apiFoodRouter);
app.use("/api/order", apiOrderRouter);
app.use("/api/cooked", apiCookedRouter);
app.use("/api/paid", apiPaidRouter);

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/example", exampleRouter);

var options = { username: "rain", password: "1" };
app.use("/hoonsDB", admin(options));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

/* let io = socketIO(server);
io.on("connection", (socket) => {
  console.log("A new browser has connected to this server");

  socket.on("disconnect", () => {
    console.log("The browser was disconnected");
  });
});
 */

/* app.io.on("connection", function (socket) {
  console.log("A new browser has connected to this server");
  socket.broadcast.emit("welcome", "first connection");

  socket.on("init", function (data) {
    console.log(data.name);
    socket.broadcast.emit("welcome", `${data.name}`);
  });
});
 */
/* socket.on("disconnect", () => {
    console.log("The browser was disconnected");
  }); */
/* app.io.on("connection", (socket) => {
  let counter = 0;
  setInterval(() => {
    socket.emit("hello", ++counter);
  }, 1000);
}); */

module.exports = app;

/*

server.get('/', (req,res)=>{
    User.find()
    .then((result)=>{console.log(result); res.json(result);})
    .catch((err)=>{console.log('error'); console.log(err)})
})    

server.post('/api/user',(req,res)=>{
    let newUser = new User();
        newUser.email = req.body.email;
        newUser.name = req.body.name;
        newUser.age = Number(req.body.age);
    newUser.save()
    .then((user)=>{console.log(user); res.json({ message :"user Created Successfully"})})
    .catch((err)=>{console.log(err); res.json({message : "user was not Created Successfully"})})
})


server.get('/api/user/:id',(req,res)=>{
   User.find({name : req.params.id}
    .then((result)=>{res.json(result)})
    .catch((err)=>{console.log(err)}))

})

server.put('/api/user/:id',(req,res)=>{
  User.findOneAndUpdate(
    {name : req.params.id},{name : req.body.name, email : req.body.email, age : req.body.age}
    .then((result)=>{res.json(result)})
    .catch((err)=>{console.log(err)}))

})

server.delete('/api/user/:id',(req,res)=>{
   User.findOneAndRemove(
    {name : req.params.id}.then((result)=>{res.json(result)}).catch((err)=>{console.log(err)}))


})

*/
