var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const foodSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      min: 0,
      max: 100000,
    },
    type: {
      type: String,
    },
    image: {
      type: Buffer,
      contentsType: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Food", foodSchema); //콜렉션에 모델을 연결한다.
