var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    server: {
      type: String,
      required: true,
    },
    tableNO: {
      type: String,
    },
    totalPrice: {
      type: Number,
    },
    order_InTime: {
      type: String,
    },
    cooked_InTime: {
      type: String,
    },
    paid_InTime: {
      type: String,
    },

    status: {
      type: Number,
    },
    orderList: [],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", OrderSchema); //콜렉션에 모델을 연결한다.
