require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  networks: {
    arbitrum_sepolia: {
      url: `https://arb-sepolia.g.alchemy.com/v2/-${process.env.ARBITRUM_KEY}`,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 421614,
    },
  },
};
