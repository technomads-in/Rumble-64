const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment-timezone");
const datelondon = moment.tz(Date.now(), "Europe/London");

const loginSchema = new Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    trim: true,
  },
  createdAt: { type: Date, default: datelondon },
  updatedAt: { type: Date, default: datelondon },
});

module.exports = mongoose.model("login", loginSchema);
