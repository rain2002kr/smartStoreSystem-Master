var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const userchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    pwd: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userchema); //콜렉션에 모델을 연결한다.
