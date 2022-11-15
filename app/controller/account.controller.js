const axios = require("axios");
const singleTrnNft = require("../model/nfts.model");
const fsp = require("fs").promises;
const path = require("path");
const dir1 = "./public1";
const directory = "./public1";
const HTTP = require("../constants/responseCode.constant");
// const singleTrnNft = [];
// const data = [];

// async function readingDirectory(directory) {
//   console.log("Reading directory ", directory);
//   const fileNames = await fsp.readdir(directory);
//   // console.log(fileNames);
//   for (let file of fileNames) {
//     const absolutePath = path.join(directory, file);

//     const data = await fsp.readFile(absolutePath);
//     let p = JSON.parse(data);
//     for (const tokenAddress of p) {
//       // console.log(d);
//       const endpoint = `https://public-api.solscan.io/token/meta?tokenAddress=${tokenAddress}`;

//       axios
//         .get(endpoint)
//         .then((response) => {
//           // console.log(response.data);
//           const data = response.data;
//           // console.log("🚀 ~ file: main.js ~ line 27 ~ .then ~ data", data.name);
//           // data.push({
//           //   tokenAddress
//           // })
//           // const i = singleTrnNft(data);
//           // console.log(d);

//           singleTrnNft({
//             name: data.name,
//             symbol: data.symbol,
//             decimals: data.decimals,
//             tokenAuthority: data.tokenAuthority,
//             supply: data.supply,
//             type: data.type,
//             tokenAddress,
//           }).save();
//           // console.log(data);
//         })
//         .catch((error) => {
//           console.log(error);
//         });
//     }
//   }
// }

// readingDirectory(dir1);

const accountNft = async (req, res) => {
  try {
    const fileNames = await fsp.readdir(directory);
    // console.log(fileNames);
    for (let file of fileNames) {
      const absolutePath = path.join(directory, file);

      const data = await fsp.readFile(absolutePath);
      let p = JSON.parse(data);
      for (const tokenAddress of p) {
        // console.log(d);
        const endpoint = `https://public-api.solscan.io/token/meta?tokenAddress=${tokenAddress}`;

        axios
          .get(endpoint)
          .then(async (response) => {
            // console.log(response.data);
            const data = response.data;
            const check = await singleTrnNft.find({ name: data.name });
            if (check) return;

            // console.log("🚀 ~ file: main.js ~ line 27 ~ .then ~ data", data.name);
            // data.push({
            //   tokenAddress
            // })
            // const i = singleTrnNft(data);
            // console.log(d);

            singleTrnNft({
              name: data.name,
              symbol: data.symbol,
              decimals: data.decimals,
              tokenAuthority: data.tokenAuthority,
              supply: data.supply,
              type: data.type,
              tokenAddress,
            }).save();
            // console.log(data);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
    res.status(HTTP.SUCCESS).send({
      status: true,
      code: HTTP.SUCCESS,
      message: "Token address is store succesfuly",
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

module.exports = {
  accountNft,
};
