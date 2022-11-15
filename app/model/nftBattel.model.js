const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment-timezone");
const datelondon = moment.tz(Date.now(), "Europe/London");

const nftBattelSchema = new Schema(
  {
    roundNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    battels: [
      {
        candidate1: {
          nftNumber: {
            type: String,
            required: true,
          },
          // token data ======
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

          nftType: {
            type: String,
            required: true,
          },
          elementalPower: {
            type: Number,
            required: true,
          },
          percentage: {
            type: Number,
            required: true,
          },
          rarityBoost: {
            type: Number,
            required: true,
          },
          randomRoll: {
            type: Number,
            required: true,
          },
          attackPower: {
            type: Number,
            required: true,
          },
        },
        candidate2: {
          nftNumber: {
            type: String,
            required: true,
          },

          // token data ======
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

          nftType: {
            type: String,
            required: true,
          },
          elementalPower: {
            type: Number,
            required: true,
          },
          percentage: {
            type: Number,
            required: true,
          },
          rarityBoost: {
            type: Number,
            required: true,
          },
          randomRoll: {
            type: Number,
            required: true,
          },
          attackPower: {
            type: Number,
            required: true,
          },
        },
        attackPowerDiff: {
          type: Number,
          required: true,
        },
        winnerNft: {
          type: mongoose.Schema.Types.ObjectId,
          required: [true, "Userid is required"],
        },
        looserNft: {
          type: mongoose.Schema.Types.ObjectId,
          required: [true, "Userid is required"],
        },
      },
    ],
    createdAt: { type: Date, default: datelondon },
    updatedAt: { type: Date, default: datelondon },
  },
  { versionKey: false }
);

module.exports = mongoose.model("NftBattel", nftBattelSchema);
