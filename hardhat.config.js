require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */

require("dotenv").config();
require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.19",
  // defaultNetwork: "volta",
  networks: {
    hardhat: {},
    //volta: {
    // url: API_URL,
    // accounts: [`0x${PRIVATE_KEY}`],
    // gas: 210000000,
    // gasPrice: 800000000000,
    // name: "volta",
    // chainId: 31337,
    // url: "http://localhost:8545",
    // gas: 2100000,
    // gasPrice: 800000000000,
    //},
    sepolia: {
      url: process.env.API_URL,
      // accounts: [SEPOLIA_PRIVATE_KEY]
      accounts: [`0x${process.env.PRIVATE_KEY}`],
      gas: 2100000,
      gasPrice: 800000000000,
    },
  },
};
