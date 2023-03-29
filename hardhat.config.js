require("@nomicfoundation/hardhat-toolbox");
//require("@nomiclabs/hardhat-waffle");
require("solidity-coverage");
require("@nomiclabs/hardhat-solhint");
require("hardhat-gas-reporter");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
        compilers:[{
            version:    "0.8.17",
            settings: {
                optimizer: {
                    enabled: true,
                    runs: 200
                }
            }
        }]
    }

};