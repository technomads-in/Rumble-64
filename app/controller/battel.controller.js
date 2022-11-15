const NftBattel = require("../model/nftBattel.model");
const HTTP = require("../constants/responseCode.constant");
const WinnerNft = require("../model/winnerNft.model");
const User = require("../model/login.model");

const battelNft = async (req, res) => {
  try {
    const { roundNumber } = req.body;
    const nftBattel = await NftBattel.findOne({ roundNumber });
    // console.log(nftBattel);

    res
      .status(HTTP.SUCCESS)
      .send({ status: true, code: HTTP.SUCCESS, data: { nftBattel } });
  } catch (e) {
    console.log(e);
    res.status(HTTP.SUCCESS).send({
      status: false,
      code: HTTP.INTERNAL_SERVER_ERROR,
      message: "Something went wrong!",
    });
  }
};

const winnerNft = async (req, res) => {
  try {
    const { roundNumber } = req.body;
    const winNft = await WinnerNft.findOne({ roundNumber });
    // console.log(winNft);

    res
      .status(HTTP.SUCCESS)
      .send({ status: true, code: HTTP.SUCCESS, data: { winNft } });
  } catch (e) {
    console.log(e);
    res.status(HTTP.SUCCESS).send({
      status: false,
      code: HTTP.INTERNAL_SERVER_ERROR,
      message: "Something went wrong!",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(HTTP.SUCCESS).send({
        status: false,
        code: HTTP.BAD_REQUEST,
        message: "All fields are required",
        data: {},
      });
    }

    const user = await User({ email, password });
    if (!user) {
      return res.status(HTTP.SUCCESS).send({
        status: false,
        code: HTTP.BAD_REQUEST,
        message: "Email is incorrect.",
        data: {},
      });
    }

    user.save();

    res.status(HTTP.SUCCESS).send({
      status: true,
      code: HTTP.SUCCESS,
      message: "User login sucessfuly",
      data: {},
    });
  } catch (e) {
    console.log(e);
    res.status(HTTP.SUCCESS).send({
      status: false,
      code: HTTP.INTERNAL_SERVER_ERROR,
      message: "Something went wrong!",
    });
  }
};

const nfttime = async (req, res) => {
  try {
    const { roundNumber } = req.body;
    const nftBattel = await NftBattel.find({});
    // console.log(nftTime);
    // console.log(nftBattel);

    res
      .status(HTTP.SUCCESS)
      .send({ status: true, code: HTTP.SUCCESS, data: { nftBattel } });
  } catch (e) {
    console.log(e);
    res.status(HTTP.SUCCESS).send({
      status: false,
      code: HTTP.INTERNAL_SERVER_ERROR,
      message: "Something went wrong!",
    });
  }
};
module.exports = {
  battelNft,
  winnerNft,
  loginUser,
  nfttime,
};
