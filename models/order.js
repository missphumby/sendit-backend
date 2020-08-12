const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const orderSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: false,
  },
  pickup: {
    type: String,
    required: true,
  },

  destination: {
    type: String,
    required: true,
  },

  recName: {
    type: String,
    required: true,
  },

  recMobileNo: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    default: "1000"
  },
  status: {
    type: String,
    default: "In transit",
  },
});

orderSchema.plugin(AutoIncrement, { inc_field: "orderId" });

module.exports = mongoose.model("orders", orderSchema);
