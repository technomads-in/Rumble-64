const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment-timezone");
const datelondon = moment.tz(Date.now(), "Europe/London");

const nftSchema = new Schema(
  {
    nftNumber: {
      type: String,
      required: true,
      // unique: true,
    },
    // nftToken: [
    //   {
    //     owner_wallet: {
    //       type: String,
    //       required: true,
    //     },
    //     associated_token_address: {
    //       type: String,
    //       required: true,
    //     },
    //     mint_account: {
    //       type: String,
    //       required: true,
    //     },
    //     metadata_account: {
    //       type: String,
    //       required: true,
    //     },
    //   },
    // ],

    // owner_wallet: {
    //     type: String,
    //     required: true
    // },
    // associated_token_address: {
    //     type: String,
    //     required: true
    // },
    // mint_account: {
    //     type: String,
    //     required: true
    // },
    // metadata_account: {
    //     type: String,
    //     required: true
    // },

    nftType: {
      type: String,
      required: true,
    },
    elementalPower: {
      type: Number,
      // required: true,
    },
    rarityBoost: {
      type: Number,
      required: true,
    },
    createdAt: { type: Date, default: datelondon },
    updatedAt: { type: Date, default: datelondon },
  },
  { versionKey: false }
);

module.exports = mongoose.model("Nft", nftSchema);
