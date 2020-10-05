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
  current_loc: {
    type: String,
    default: ""
    
  },
  status: {
    type: String,
    default: "Ready-to-pickup",
  },
});

orderSchema.plugin(AutoIncrement, { inc_field: "orderId" });

module.exports = mongoose.model("orders", orderSchema);
