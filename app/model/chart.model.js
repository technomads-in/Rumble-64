const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment-timezone");
const datelondon = moment.tz(Date.now(), "Europe/London");

const advantageChart = new Schema(
  {
    element_name: {
      type: String,
      required: true,
    },
    check_element: [
      {
        name: {
          type: String,
        },
        value: {
          type: Number,
        },
      },
    ],
    elemental_power: {
      type: Array,
    },
    createdAt: { type: Date, default: datelondon },
    updatedAt: { type: Date, default: datelondon },
  },
  { versionKey: false }
);

module.exports = mongoose.model("AdvantageChart", advantageChart);
