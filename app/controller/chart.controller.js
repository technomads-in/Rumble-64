const AdvantageChart = require("../model/chart.model");
const Nft = require("../model/nft.model");
const WinnerNft = require("../model/winnerNft.model");
const LooserNft = require("../model/looserNft.model");
const NftBattel = require("../model/nftBattel.model");
const HTTP = require("../constants/responseCode.constant");
const excel = require("exceljs");
const {
  genrateRandomNumber,
  calculateRarityBoost,
  curWinnerAndLooser,
} = require("../utils/helper");
const nftTokensData = require("../utils/nftTokensData");
const upgredApi = require("../model/nfts.model");

const fsp = require("fs").promises;
const path = require("path");
const directory = "./public/Json";

//Add default NFT records
(async function defaultNftData(req, res) {
  try {
    let defaultNftList = [];
    // const nftTypes = ["fire", "water", "air", "earth", "plant", "lightening"];

    // let nftNumber = 1;

    // read file
    let nftType = "";
    let elementalPower = 0;
    const fileNames = await fsp.readdir(directory);
    // console.log(directory, " directory")
    for (let file of fileNames) {
      // console.log("Reading File ", file)
      const absolutePath = path.join(directory, file);

      const data = await fsp.readFile(absolutePath);
      let p = JSON.parse(data);
      // console.log(p.name, "name");

      for (const data of p.attributes) {
        if (data.trait_type == "Type") {
          // nftType.push(data.value);
          // console.log(data.value, " Type: value");
          nftType = data.value;
        }
        if (data.trait_type == "Power") {
          // elementalPower.push(data.value);
          // console.log(data.value, " Power: value");
          elementalPower = data.value;
        }
      }

      const rarityBoost = calculateRarityBoost(elementalPower);

      // save data
      defaultNftList.push({
        nftNumber: p.name,
        nftType,
        elementalPower,
        rarityBoost,
      });

      for (const data of defaultNftList) {
        const nftDataExists = await Nft.findOne({
          nftNumber: data.nftNumber,
          nftType: data.nftType,
        });

        if (nftDataExists) continue;

        const nftData = await Nft(data).save();
        if (!nftData) continue;
      }
    }

    // ==============

    // for (const nft of nftTypes) {
    //   if (["fire", "water", "air", "earth"].includes(nft)) {
    //     for (let nftNo = 1; nftNo <= 10; nftNo++) {
    //       const elementalPower = genrateRandomNumber(6000, 10000);
    //       const rarityBoost = calculateRarityBoost(elementalPower);

    //       // adding nft data ======
    //       // const owner_wallet = nftTokensData[nftNumber - 1].owner_wallet;
    //       // const associated_token_address =
    //       //   nftTokensData[nftNumber - 1].associated_token_address;
    //       // const mint_account = nftTokensData[nftNumber - 1].mint_account;
    //       // const metadata_account =
    //       //   nftTokensData[nftNumber - 1].metadata_account;

    //       // array of object ======
    //       // const nftToken = {
    //       //   owner_wallet,
    //       //   associated_token_address,
    //       //   mint_account,
    //       //   metadata_account,
    //       // };
    //       defaultNftList.push({
    //         nftNumber,
    //         // nftToken,
    //         nftType: nft,
    //         // elementalPower,
    //         rarityBoost,
    //       });

    //       // defaultNftList.push({ nftNumber, owner_wallet, associated_token_address, mint_account, metadata_account, nftType: nft, elementalPower, rarityBoost });
    //       // nftNumber++;
    //     }
    //   } else if (["plant", "lightening"].includes(nft)) {
    //     for (let nftNo = 1; nftNo <= 12; nftNo++) {
    //       const elementalPower = genrateRandomNumber(6000, 10000);
    //       const rarityBoost = calculateRarityBoost(elementalPower);

    //       // adding nft data
    //       // const owner_wallet = nftTokensData[nftNumber - 1].owner_wallet;
    //       // const associated_token_address =
    //       //   nftTokensData[nftNumber - 1].associated_token_address;
    //       // const mint_account = nftTokensData[nftNumber - 1].mint_account;
    //       // const metadata_account =
    //       //   nftTokensData[nftNumber - 1].metadata_account;

    //       // array of object ======
    //       // const nftToken = {
    //       //   owner_wallet,
    //       //   associated_token_address,
    //       //   mint_account,
    //       //   metadata_account,
    //       // };
    //       defaultNftList.push({
    //         nftNumber,
    //         // nftToken,
    //         nftType: nft,
    //         // elementalPower,
    //         rarityBoost,
    //       });

    //       // defaultNftList.push({ nftNumber, owner_wallet, associated_token_address, mint_account, metadata_account, nftType: nft, elementalPower, rarityBoost });

    //       // defaultNftList.push({ nftNumber, nftType: nft, elementalPower, rarityBoost });
    //       nftNumber++;
    //     }
    //   }
    // }

    // if (defaultNftList.length === 0) return;

    // for (const data of defaultNftList) {
    //   const nftDataExists = await Nft.findOne({
    //     nftNumber: data.nftNumber,
    //     nftType: data.nftType,
    //   });

    //   // const nftDataExists = await Nft.findOne({ nftNumber: data.nftNumber, owner_wallet: data.owner_wallet, associated_token_address: data.associated_token_address, mint_account: data.mint_account, metadata_account: data.metadata_account,  nftType: data.nftType })

    //   // const nftDataExists = await Nft.findOne({ nftNumber: data.nftNumber, nftType: data.nftType })
    //   if (nftDataExists) continue;

    //   const nftData = await Nft(data).save();
    //   if (!nftData) continue;
    // }

    return;
  } catch (e) {
    console.log(e);
    return;
  }
})();

// Advantage Chart
(async function defaultChart(req, res) {
  try {
    const defaultData = [
      {
        element_name: "fire",
        check_element: [
          { name: "fire", value: 0 },
          { name: "water", value: -20 },
          { name: "air", value: 10 },
          { name: "earth", value: -10 },
          { name: "plant", value: 20 },
          { name: "lightening", value: 0 },
        ],
        elemental_power: Array.from({ length: 10 }, (v, k) => k + 1),
      },
      {
        element_name: "water",
        check_element: [
          { name: "fire", value: 20 },
          { name: "water", value: 0 },
          { name: "air", value: -10 },
          { name: "earth", value: 20 },
          { name: "plant", value: -10 },
          { name: "lightening", value: 20 },
        ],
        elemental_power: Array.from({ length: 10 }, (v, k) => k + 11),
      },
      {
        element_name: "air",
        check_element: [
          { name: "fire", value: -10 },
          { name: "water", value: 10 },
          { name: "air", value: 0 },
          { name: "earth", value: -10 },
          { name: "plant", value: 10 },
          { name: "lightening", value: 0 },
        ],
        elemental_power: Array.from({ length: 10 }, (v, k) => k + 21),
      },
      {
        element_name: "earth",
        check_element: [
          { name: "fire", value: 10 },
          { name: "water", value: -20 },
          { name: "air", value: 10 },
          { name: "earth", value: 0 },
          { name: "plant", value: -10 },
          { name: "lightening", value: 10 },
        ],
        elemental_power: Array.from({ length: 10 }, (v, k) => k + 31),
      },
      {
        element_name: "plant",
        check_element: [
          { name: "fire", value: -20 },
          { name: "water", value: 10 },
          { name: "air", value: -10 },
          { name: "earth", value: 10 },
          { name: "plant", value: 0 },
          { name: "lightening", value: 10 },
        ],
        elemental_power: Array.from({ length: 12 }, (v, k) => k + 41),
      },
      {
        element_name: "lightening",
        check_element: [
          { name: "fire", value: 0 },
          { name: "water", value: 20 },
          { name: "air", value: 10 },
          { name: "earth", value: -20 },
          { name: "plant", value: -10 },
          { name: "lightening", value: 0 },
        ],
        elemental_power: Array.from({ length: 12 }, (v, k) => k + 53),
      },
    ];

    for (const data of defaultData) {
      const elementExists = await AdvantageChart.findOne({
        element_name: data.element_name,
      });
      if (elementExists) continue;
      const elementManager = await AdvantageChart(data).save();
      if (!elementManager) continue;
    }

    return;
  } catch (e) {
    console.log(e);
    return;
  }
})();

// ======================================================================================

async function rumbleNfts(req, res) {
  try {
    const { roundNumber } = req.body;

    let totalNumOfNft = 0;
    if (roundNumber === 1) totalNumOfNft = await Nft.find().count();
    else {
      const winnerOfPrveRound = await WinnerNft.findOne({
        roundNumber: roundNumber - 1,
      });
      if (winnerOfPrveRound && winnerOfPrveRound.nftList.length > 0)
        totalNumOfNft = winnerOfPrveRound.nftList.length;
    }
    // 8193 - total
    // 4096 - 1 - 20 min
    // 2048 - 2 -  7 min
    // 1024 - 3 -  1m47s61
    // 512 - 4 -  28s96
    // 256 - 5 -  9s11
    // 128 - 6 -  5s11
    // 64 - 7 -  4s11
    // 32 - 8 -  1s11
    console.log(
      "🚀 ~ file: chart.controller.js ~ line 282 ~ rumbleNfts ~ totalNumOfNft",
      totalNumOfNft
    );
    if (
      totalNumOfNft === 0 ||
      (totalNumOfNft !== 2 && (totalNumOfNft / 2) % 2 !== 0)
    )
      return res.status(HTTP.SUCCESS).send({
        status: false,
        code: HTTP.BAD_REQUEST,
        message: "Please enter a vaild round number",
        data: {},
      });

    for (let index = 1; index <= totalNumOfNft / 2; index++) {
      let winnerNFT;
      let looserNFT;
      let availableNft;
      let sameNftsSelected = null;
      let candidate1 = {};
      let candidate2 = {};
      let attackPowerDiff = 0;

      if (roundNumber === 1) {
        const usedNftIdsOfCurRound = await curWinnerAndLooser(roundNumber);
        availableNft = await Nft.find(
          { _id: { $nin: usedNftIdsOfCurRound } },
          {
            nftNumber: 1,
            nftToken: 1,
            nftType: 1,
            elementalPower: 1,
            rarityBoost: 1,
          }
        ); // added nftToken here <----------------------------
      } else {
        let availableNftIds = [];
        let allWinnerNftIds = [];
        const winnerOfPrevRound = await WinnerNft.findOne({
          roundNumber: roundNumber - 1,
        });

        if (winnerOfPrevRound && winnerOfPrevRound.nftList.length > 0)
          allWinnerNftIds = winnerOfPrevRound.nftList;
        const usedNftIdsOfCurRound = await curWinnerAndLooser(roundNumber);

        if (allWinnerNftIds.length === 0)
          return res.status(HTTP.SUCCESS).send({
            status: false,
            code: HTTP.BAD_REQUEST,
            message: "Invalid round number!",
            data: {},
          });

        for (const nftId of allWinnerNftIds) {
          var isInArray = usedNftIdsOfCurRound.some((useredNftId) =>
            useredNftId.equals(nftId)
          );
          if (!isInArray) availableNftIds.push(nftId);
        }

        // availableNft = await Nft.find({ _id: { $in: [...availableNftIds] } }, { nftNumber: 1, nftType: 1, elementalPower: 1 })
        availableNft = await Nft.find(
          { _id: { $in: [...availableNftIds] } },
          {
            nftNumber: 1,
            nftToken: 1,
            nftType: 1,
            elementalPower: 1,
            rarityBoost: 1,
          }
        ); // added nftToken here <----------------------------
      }

      if (availableNft.length === 0)
        return res.status(HTTP.SUCCESS).send({
          status: false,
          code: HTTP.BAD_REQUEST,
          message: "This round has alraedy been played",
          data: {},
        });

      let nftA;
      let nftB;

      while (sameNftsSelected === null || sameNftsSelected === true) {
        nftA = Math.floor(Math.random() * availableNft.length);
        nftB = Math.floor(Math.random() * availableNft.length);
        if (nftA === nftB) sameNftsSelected = true;
        else sameNftsSelected = false;
      }

      nftA = availableNft[nftA];
      nftB = availableNft[nftB];

      const getA = await AdvantageChart.findOne(
        {
          element_name: nftA.nftType,
          check_element: { $elemMatch: { name: nftB.nftType } },
        },
        { "check_element.$": 1, element_name: 1 }
      );

      const getB = await AdvantageChart.findOne(
        {
          element_name: nftB.nftType,
          check_element: { $elemMatch: { name: nftA.nftType } },
        },
        { "check_element.$": 1, element_name: 1 }
      );

      const randomRollOfA = genrateRandomNumber(0, 3000);
      const randomRollOfB = genrateRandomNumber(0, 3000);

      const AttackPowerOfA =
        nftA.elementalPower +
        nftA.elementalPower * (getA.check_element[0].value / 100) +
        nftA.elementalPower * (nftA.rarityBoost / 100) +
        randomRollOfA;

      const AttackPowerOfB =
        nftB.elementalPower +
        nftB.elementalPower * (getB.check_element[0].value / 100) +
        nftB.elementalPower * (nftB.rarityBoost / 100) +
        randomRollOfB;

      if (AttackPowerOfA > AttackPowerOfB) {
        winnerNFT = nftA;
        looserNFT = nftB;

        candidate1 = {
          nftNumber: winnerNFT.nftNumber,
          // nft token added ======
          nftToken: winnerNFT.nftToken,

          nftType: winnerNFT.nftType,
          elementalPower: winnerNFT.elementalPower,
          percentage: getA.check_element[0].value,
          rarityBoost: winnerNFT.rarityBoost,
          randomRoll: randomRollOfA,
          attackPower: AttackPowerOfA,
        };

        candidate2 = {
          nftNumber: looserNFT.nftNumber,
          // nft token added ======
          nftToken: looserNFT.nftToken,

          nftType: looserNFT.nftType,
          elementalPower: looserNFT.elementalPower,
          percentage: getB.check_element[0].value,
          rarityBoost: looserNFT.rarityBoost,
          randomRoll: randomRollOfB,
          attackPower: AttackPowerOfB,
        };

        attackPowerDiff = AttackPowerOfA - AttackPowerOfB;
      } else if (AttackPowerOfA < AttackPowerOfB) {
        winnerNFT = nftB;
        looserNFT = nftA;

        candidate1 = {
          nftNumber: winnerNFT.nftNumber,
          // nft token added ======
          nftToken: winnerNFT.nftToken,

          nftType: winnerNFT.nftType,
          elementalPower: winnerNFT.elementalPower,
          percentage: getB.check_element[0].value,
          rarityBoost: winnerNFT.rarityBoost,
          randomRoll: randomRollOfB,
          attackPower: AttackPowerOfB,
        };

        candidate2 = {
          nftNumber: looserNFT.nftNumber,
          // nft token added ======
          nftToken: looserNFT.nftToken,

          nftType: looserNFT.nftType,
          elementalPower: looserNFT.elementalPower,
          percentage: getA.check_element[0].value,
          rarityBoost: looserNFT.rarityBoost,
          randomRoll: randomRollOfA,
          attackPower: AttackPowerOfA,
        };

        attackPowerDiff = AttackPowerOfB - AttackPowerOfA;
      } else if (AttackPowerOfA === AttackPowerOfB) {
        return res.status(HTTP.SUCCESS).send({
          status: false,
          code: HTTP.BAD_REQUEST,
          message: "It's tie",
          data: {},
        });
      } else {
        return res.status(HTTP.SUCCESS).send({
          status: false,
          code: HTTP.BAD_REQUEST,
          message: "Invalid NFT data!",
          data: {},
        });
      }
      // const winnerNFTData = await WinnerNft.findOneAndUpdate({ roundNumber }, { $push: { nftList: winnerNFT._id } }, { upsert: true, returnNewDocument: true });
      // const looserNFTData = await LooserNft.findOneAndUpdate({ roundNumber }, { $push: { nftList: looserNFT._id } }, { upsert: true, returnNewDocument: true });

      // added nftNumber and mint_account ======
      const winnerNFTData = await WinnerNft.findOneAndUpdate(
        { roundNumber },
        {
          $push: {
            nftList: winnerNFT._id,
            nftData: [
              {
                nftNumber: winnerNFT.nftNumber,
                // mint_account: winnerNFT.nftToken[0].mint_account,
              },
            ],
          },
        },
        { upsert: true, returnNewDocument: true }
      );
      const looserNFTData = await LooserNft.findOneAndUpdate(
        { roundNumber },
        {
          $push: {
            nftList: looserNFT._id,
            nftData: [
              {
                nftNumber: looserNFT.nftNumber,
                // tokenAddress: data[0].tokenAddress,
              },
            ],
          },
        },
        { upsert: true, returnNewDocument: true }
      );

      // ------------------------------------------------------
      // const data = await upgredApi.find({});
      // // console.log(data);
      // for (let d of data) {
      //   // console.log(d.name);
      //   console.log(d.name, " -------- NAME.");
      //   const nftData = [{ nftNumber: d.name }];
      //   // console.log("🚀 ~ file: chart.controller.js ~ line 535 ~ rumbleNfts ~ nftData", nftData)
      //   const data_ = await LooserNft.findOne({ nftNumber: nftData.nftNumber });
      //   console.log(data_.nftData, " -------- nftnumber.");
      //   // const looserData = await LooserNft.findOneAndUpdate(
      //   //   { nftNumber: d.name },
      //   //   {
      //   //     tokenAddress: d.tokenAddress,
      //   //   },
      //   //   { new: true }
      //   // );
      // }

      const battelInfo = {
        candidate1,
        candidate2,
        winnerNft: winnerNFT._id,
        looserNft: looserNFT._id,
        attackPowerDiff,
      };

      const nftBattelData = await NftBattel.findOneAndUpdate(
        { roundNumber },
        { $push: { battels: battelInfo } },
        { upsert: true, returnNewDocument: true }
      );
    }

    const looserData = await LooserNft.find({});

    for (const data of looserData) {
      for (const data_ of data.nftData) {
        console.log(
          "🚀 ~ file: chart.controller.js ~ line 573 ~ rumbleNfts ~ data_",
          data_.nftNumber
        );
        const nftsModel = await upgredApi.findOne({ name: data_.nftNumber });
        console.log(
          "🚀 ~ file: chart.controller.js ~ line 575 ~ rumbleNfts ~ nftsModel",
          nftsModel.tokenAddress
        );
        data_.tokenAddress = nftsModel.tokenAddress;
      }
      data.save();
    }

    return res.status(HTTP.SUCCESS).send({
      status: true,
      code: HTTP.SUCCESS,
      message: `Battle is finished for day ${roundNumber}`,
      data: {},
    });
  } catch (e) {
    console.log(e);
    return res.status(HTTP.SUCCESS).send({
      status: false,
      code: HTTP.INTERNAL_SERVER_ERROR,
      message: "Something went wrong!",
    });
  }
}

async function generateExcel(req, res) {
  try {
    const { roundNumber } = req.query;
    console.log(
      "🚀 ~ file: chart.controller.js ~ line 561 ~ generateExcel ~ roundNumber",
      roundNumber
    );
    var batteldata = [];
    var sortedBattelData = [];

    batteldata = await NftBattel.findOne({ roundNumber });

    if (
      !batteldata ||
      !batteldata.battels ||
      (batteldata.battels && batteldata.battels.length === 0)
    )
      return res.status(HTTP.SUCCESS).send({
        status: false,
        code: HTTP.NOT_FOUND,
        message: "Battel data not found!",
        data: {},
      });

    let xmlData = [];
    let sortedXmlData = [];

    //battel wise data
    batteldata.battels.forEach((battel) => {
      const { candidate1, candidate2 } = battel;

      xmlData.push({
        roundName: batteldata.roundNumber ? batteldata.roundNumber : null,

        candidate1Number: candidate1.nftNumber ? candidate1.nftNumber : null,
        candidate1NftType: candidate1.nftType ? candidate1.nftType : null,
        candidate1ElementalPower: candidate1.elementalPower
          ? candidate1.elementalPower
          : null,
        candidate1Percentage: candidate1.percentage
          ? candidate1.elementalPower * (candidate1.percentage / 100)
          : 0,
        candidate1RarityBoost: candidate1.rarityBoost
          ? candidate1.elementalPower * (candidate1.rarityBoost / 100)
          : 0,
        candidate1RandomRoll: candidate1.randomRoll
          ? candidate1.randomRoll
          : null,
        candidate1AttackPower: candidate1.attackPower
          ? candidate1.attackPower
          : null,

        // added Token data ======
        // candidate1OwnerWallet: candidate1.nftToken[0].owner_wallet
        //   ? candidate1.nftToken[0].owner_wallet
        //   : null,
        // candidate1TokenAddress: candidate1.nftToken[0].associated_token_address
        //   ? candidate1.nftToken[0].associated_token_address
        //   : null,
        // candidate1MintAccount: candidate1.nftToken[0].mint_account
        //   ? candidate1.nftToken[0].mint_account
        //   : null,
        // candidate1MetadataAccount: candidate1.nftToken[0].metadata_account
        //   ? candidate1.nftToken[0].metadata_account
        //   : null,

        candidate2Number: candidate2.nftNumber ? candidate2.nftNumber : null,
        candidate2NftType: candidate2.nftType ? candidate2.nftType : null,
        candidate2ElementalPower: candidate2.elementalPower
          ? candidate2.elementalPower
          : null,
        candidate2Percentage: candidate2.percentage
          ? candidate2.elementalPower * (candidate2.percentage / 100)
          : 0,
        candidate2RarityBoost: candidate2.rarityBoost
          ? candidate2.elementalPower * (candidate2.rarityBoost / 100)
          : 0,
        candidate2RandomRoll: candidate2.randomRoll
          ? candidate2.randomRoll
          : null,
        candidate2AttackPower: candidate2.attackPower
          ? candidate2.attackPower
          : null,

        // added Token data ======
        // candidate2OwnerWallet: candidate2.nftToken[0].owner_wallet
        //   ? candidate2.nftToken[0].owner_wallet
        //   : null,
        // candidate2TokenAddress: candidate2.nftToken[0].associated_token_address
        //   ? candidate2.nftToken[0].associated_token_address
        //   : null,
        // candidate2MintAccount: candidate2.nftToken[0].mint_account
        //   ? candidate2.nftToken[0].mint_account
        //   : null,
        // candidate2MetadataAccount: candidate2.nftToken[0].metadata_account
        //   ? candidate2.nftToken[0].metadata_account
        //   : null,

        winnerNftId: battel.winnerNft ? battel.winnerNft.toString() : null,
        looserNftId: battel.looserNft ? battel.looserNft.toString() : null,

        winnerNftName: candidate1.nftNumber ? candidate1.nftNumber : null,
        looserNftName: candidate2.nftNumber ? candidate2.nftNumber : null,

        attackPowerDiff: battel.attackPowerDiff
          ? battel.attackPowerDiff.toString()
          : 0,
      });
    });

    //attack power wise data
    sortedBattelData = batteldata.battels.sort(
      (a, b) => b.attackPowerDiff - a.attackPowerDiff
    );

    let rank = 1;
    sortedBattelData.forEach((battel) => {
      const { candidate1, candidate2 } = battel;
      sortedXmlData.push({
        roundName: batteldata.roundNumber ? batteldata.roundNumber : null,

        candidate1Number: candidate1.nftNumber ? candidate1.nftNumber : null,
        candidate1NftType: candidate1.nftType ? candidate1.nftType : null,
        candidate1ElementalPower: candidate1.elementalPower
          ? candidate1.elementalPower
          : null,
        candidate1Percentage: candidate1.percentage
          ? candidate1.elementalPower * (candidate1.percentage / 100)
          : 0,
        candidate1RarityBoost: candidate1.rarityBoost
          ? candidate1.elementalPower * (candidate1.rarityBoost / 100)
          : 0,
        candidate1RandomRoll: candidate1.randomRoll
          ? candidate1.randomRoll
          : null,
        candidate1AttackPower: candidate1.attackPower
          ? candidate1.attackPower
          : null,
        // added Token data ======
        // candidate1OwnerWallet: candidate1.nftToken[0].owner_wallet
        //   ? candidate1.nftToken[0].owner_wallet
        //   : null,
        // candidate1TokenAddress: candidate1.nftToken[0].associated_token_address
        //   ? candidate1.nftToken[0].associated_token_address
        //   : null,
        // candidate1MintAccount: candidate1.nftToken[0].mint_account
        //   ? candidate1.nftToken[0].mint_account
        //   : null,
        // candidate1MetadataAccount: candidate1.nftToken[0].metadata_account
        //   ? candidate1.nftToken[0].metadata_account
        //   : null,

        candidate2Number: candidate2.nftNumber ? candidate2.nftNumber : null,
        candidate2NftType: candidate2.nftType ? candidate2.nftType : null,
        candidate2ElementalPower: candidate2.elementalPower
          ? candidate2.elementalPower
          : null,
        candidate2Percentage: candidate2.percentage
          ? candidate2.elementalPower * (candidate2.percentage / 100)
          : 0,
        candidate2RarityBoost: candidate2.rarityBoost
          ? candidate2.elementalPower * (candidate2.rarityBoost / 100)
          : 0,
        candidate2RandomRoll: candidate2.randomRoll
          ? candidate2.randomRoll
          : null,
        candidate2AttackPower: candidate2.attackPower
          ? candidate2.attackPower
          : null,
        // added Token data ======
        // candidate2OwnerWallet: candidate2.nftToken[0].owner_wallet
        //   ? candidate2.nftToken[0].owner_wallet
        //   : null,
        // candidate2TokenAddress: candidate2.nftToken[0].associated_token_address
        //   ? candidate2.nftToken[0].associated_token_address
        //   : null,
        // candidate2MintAccount: candidate2.nftToken[0].mint_account
        //   ? candidate2.nftToken[0].mint_account
        //   : null,
        // candidate2MetadataAccount: candidate2.nftToken[0].metadata_account
        //   ? candidate2.nftToken[0].metadata_account
        //   : null,

        winnerNftId: battel.winnerNft ? battel.winnerNft.toString() : null,
        looserNftId: battel.looserNft ? battel.looserNft.toString() : null,

        winnerNftName: candidate1.nftNumber ? candidate1.nftNumber : null,
        looserNftName: candidate2.nftNumber ? candidate2.nftNumber : null,

        attackPowerDiff: battel.attackPowerDiff
          ? battel.attackPowerDiff.toString()
          : 0,
        winnerRank: rank,
      });
      rank++;
    });

    //create workbook
    let workbook = new excel.Workbook();

    let worksheet = workbook.addWorksheet("Battel");
    let sortedWorksheet = workbook.addWorksheet("Sorted Battel");

    worksheet.columns = [
      { header: "Round number", key: "roundName", width: 25 },

      { header: "Candidate1 Name", key: "candidate1Number", width: 25 },
      { header: "Candidate1 Type", key: "candidate1NftType", width: 25 },
      {
        header: "Candidate1 Elemental Power",
        key: "candidate1ElementalPower",
        width: 25,
      },
      {
        header: "Candidate1 Percentage",
        key: "candidate1Percentage",
        width: 25,
      },
      {
        header: "Candidate1 Rarity Boost",
        key: "candidate1RarityBoost",
        width: 25,
      },
      {
        header: "Candidate1 Random Roll",
        key: "candidate1RandomRoll",
        width: 25,
      },
      {
        header: "Candidate1 Attack Power",
        key: "candidate1AttackPower",
        width: 25,
      },
      // added token data =====
      {
        header: "Candidate1 Owner Wallet",
        key: "candidate1OwnerWallet",
        width: 25,
      },
      {
        header: "Candidate1 Token Address",
        key: "candidate1TokenAddress",
        width: 25,
      },
      {
        header: "Candidate1 Mint Account",
        key: "candidate1MintAccount",
        width: 25,
      },
      {
        header: "Candidate1 Metadata Account",
        key: "candidate1MetadataAccount",
        width: 25,
      },

      { header: "Candidate2 Name", key: "candidate2Number", width: 25 },
      { header: "Candidate2 Type", key: "candidate2NftType", width: 25 },
      {
        header: "Candidate2 Elemental Power",
        key: "candidate2ElementalPower",
        width: 25,
      },
      {
        header: "Candidate2 Percentage",
        key: "candidate2Percentage",
        width: 25,
      },
      {
        header: "Candidate2 Rarity Boost",
        key: "candidate2RarityBoost",
        width: 25,
      },
      {
        header: "Candidate2 Random Roll",
        key: "candidate2RandomRoll",
        width: 25,
      },
      {
        header: "Candidate2 Attack Power",
        key: "candidate2AttackPower",
        width: 25,
      },
      // added token data =====
      {
        header: "Candidate2 Owner Wallet",
        key: "candidate2OwnerWallet",
        width: 25,
      },
      {
        header: "Candidate2 Token Address",
        key: "candidate2TokenAddress",
        width: 25,
      },
      {
        header: "Candidate2 Mint Account",
        key: "candidate2MintAccount",
        width: 25,
      },
      {
        header: "Candidate2 Metadata Account",
        key: "candidate2MetadataAccount",
        width: 25,
      },

      { header: "Winner Nft ID", key: "winnerNftId", width: 25 },
      { header: "Looser Nft ID", key: "looserNftId", width: 25 },

      { header: "Winner Nft Name", key: "winnerNftName", width: 25 },
      { header: "Looser Nft Name", key: "looserNftName", width: 25 },

      { header: "Attack Power Differance", key: "attackPowerDiff", width: 25 },
    ];

    sortedWorksheet.columns = [
      { header: "Round number", key: "roundName", width: 25 },

      { header: "Candidate1 Name", key: "candidate1Number", width: 25 },
      { header: "Candidate1 Type", key: "candidate1NftType", width: 25 },
      {
        header: "Candidate1 Elemental Power",
        key: "candidate1ElementalPower",
        width: 25,
      },
      {
        header: "Candidate1 Rercentage",
        key: "candidate1Percentage",
        width: 25,
      },
      {
        header: "Candidate1 Random Roll",
        key: "candidate1RandomRoll",
        width: 25,
      },
      {
        header: "Candidate1 Attack Power",
        key: "candidate1AttackPower",
        width: 25,
      },
      // added token data =====
      {
        header: "Candidate1 Owner Wallet",
        key: "candidate1OwnerWallet",
        width: 25,
      },
      {
        header: "Candidate1 Token Address",
        key: "candidate1TokenAddress",
        width: 25,
      },
      {
        header: "Candidate1 Mint Account",
        key: "candidate1MintAccount",
        width: 25,
      },
      {
        header: "Candidate1 Metadata Account",
        key: "candidate1MetadataAccount",
        width: 25,
      },

      { header: "Candidate2 Name", key: "candidate2Number", width: 25 },
      { header: "Candidate2 Type", key: "candidate2NftType", width: 25 },
      {
        header: "Candidate2 Elemental Power",
        key: "candidate2ElementalPower",
        width: 25,
      },
      {
        header: "Candidate2 Percentage",
        key: "candidate2Percentage",
        width: 25,
      },
      {
        header: "Candidate2 Random Roll",
        key: "candidate2RandomRoll",
        width: 25,
      },
      {
        header: "Candidate2 Attack Power",
        key: "candidate2AttackPower",
        width: 25,
      },
      // added token data =====
      {
        header: "Candidate2 Owner Wallet",
        key: "candidate2OwnerWallet",
        width: 25,
      },
      {
        header: "Candidate2 Token Address",
        key: "candidate2TokenAddress",
        width: 25,
      },
      {
        header: "Candidate2 Mint Account",
        key: "candidate2MintAccount",
        width: 25,
      },
      {
        header: "Candidate2 Metadata Account",
        key: "candidate2MetadataAccount",
        width: 25,
      },

      { header: "Winner Nft ID", key: "winnerNftId", width: 25 },
      { header: "Looser Nft ID", key: "looserNftId", width: 25 },

      { header: "Winner Nft Name", key: "winnerNftName", width: 25 },
      { header: "Looser Nft Name", key: "looserNftName", width: 25 },

      { header: "Attack Power Differance", key: "attackPowerDiff", width: 25 },
      { header: "Winner Rank", key: "winnerRank", width: 10 },
    ];

    // Add Array Rows
    worksheet.addRows(xmlData);
    sortedWorksheet.addRows(sortedXmlData);

    // res is a Stream object
    await res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    await res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + `battelRound-${batteldata.roundNumber}.xlsx`
    );

    return workbook.xlsx.write(res).then(() => {
      res.status(200).end();
    });
  } catch (e) {
    console.log(e);
    return res.status(HTTP.SUCCESS).send({
      status: false,
      code: HTTP.INTERNAL_SERVER_ERROR,
      message: "Something went wrong!",
      data: {},
    });
  }
}

module.exports = {
  rumbleNfts,
  generateExcel,
};
