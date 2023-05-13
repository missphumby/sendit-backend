const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const postSchema = mongoose.Schema(
  {
    _id: Number,

    firstname: {
      type: String,
      required: true,
    },

    lastname: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      // match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },

    username: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
      // unique: true,
    },

    password: {
      type: String,
      required: true,
    },
    confirm_password: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
  },
  { _id: false }
);

postSchema.plugin(AutoIncrement);
module.exports = mongoose.model("sendit_users", postSchema);
