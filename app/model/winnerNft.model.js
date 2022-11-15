const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment-timezone");
const datelondon = moment.tz(Date.now(), "Europe/London");

const winnerNftSchema = new Schema(
  {
    roundNumber: {
      type: Number,
      // required: true,
    },
    nftList: {
      type: Array,
      default: [],
    },
    nftData: [
      {
        nftNumber: {
          type: String,
          required: true,
        },
        mint_account: {
          type: String,
          required: true,
        },
      },
    ],
    createdAt: { type: Date, default: datelondon },
    updatedAt: { type: Date, default: datelondon },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("WinnerNft", winnerNftSchema);
