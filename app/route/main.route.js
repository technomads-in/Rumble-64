const express = require("express");
const router = express.Router();
const chartController = require("../controller/chart.controller");
const battelNft = require("../controller/battel.controller");
// const accNft  = require("../controller/account.controller")

// router.post('/rumble', chartController.rumbleElements)
router.post("/rumbleNfts", chartController.rumbleNfts);
router.get("/generateExcel", chartController.generateExcel);

// router.post('/rumbleRound1', chartController.roundOne)
// router.post('/rumbleRound2', chartController.roundTwo)

// get a battel nft data with one
router.post("/Battelnft", battelNft.battelNft);

// get a winer data all winnwr
router.post("/Winnernft", battelNft.winnerNft);

// login api
router.post("/login", battelNft.loginUser);

// time api
router.post("/time", battelNft.nfttime);

// accunot api
// router.post("/account", accNft.accountNft);

module.exports = router;
