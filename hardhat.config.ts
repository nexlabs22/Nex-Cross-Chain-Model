import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenvenc from '@chainlink/env-enc'
dotenvenc.config();
// import './tasks';
// require("hardhat-contract-sizer");
import "hardhat-contract-sizer"
import "@nomicfoundation/hardhat-foundry";
import "hardhat-gas-reporter"
require("@openzeppelin/hardhat-upgrades");
require("dotenv").config()
// import "@nomicfoundation/hardhat-verify";

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHEREUM_SEPOLIA_RPC_URL = process.env.ETHEREUM_SEPOLIA_RPC_URL;
const POLYGON_MUMBAI_RPC_URL = process.env.POLYGON_MUMBAI_RPC_URL;
const OPTIMISM_GOERLI_RPC_URL = process.env.OPTIMISM_GOERLI_RPC_URL;
const ARBITRUM_TESTNET_RPC_URL = process.env.ARBITRUM_TESTNET_RPC_URL;
const ARBITRUM_SEPOLIA_RPC_URL = process.env.ARBITRUM_SEPOLIA_RPC_URL;
const AVALANCHE_FUJI_RPC_URL = process.env.AVALANCHE_FUJI_RPC_URL;


const config: HardhatUserConfig = {
  // solidity: '0.8.19',
  solidity: {
    compilers: [
      {
        version: "0.8.7",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.19",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.1",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.4.18",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.7.0",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  networks: {
    hardhat: {
      chainId: 31337
    },
    sepolia: {
      url: ETHEREUM_SEPOLIA_RPC_URL !== undefined ? ETHEREUM_SEPOLIA_RPC_URL : '',
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      chainId: 11155111
    },
    polygonMumbai: {
      url: POLYGON_MUMBAI_RPC_URL !== undefined ? POLYGON_MUMBAI_RPC_URL : '',
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      chainId: 80001
    },
    optimismGoerli: {
      url: OPTIMISM_GOERLI_RPC_URL !== undefined ? OPTIMISM_GOERLI_RPC_URL : '',
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      chainId: 420,
    },
    arbitrumTestnet: {
      url: ARBITRUM_TESTNET_RPC_URL !== undefined ? ARBITRUM_TESTNET_RPC_URL : '',
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      chainId: 421613
    },
    arbitrumSepolia: {
      url: ARBITRUM_SEPOLIA_RPC_URL !== undefined ? ARBITRUM_SEPOLIA_RPC_URL : '',
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      chainId: 421614
    },
    avalancheFuji: {
      url: AVALANCHE_FUJI_RPC_URL !== undefined ? AVALANCHE_FUJI_RPC_URL : '',
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      chainId: 43113
    }
  },
  typechain: {
    externalArtifacts: ['./abi/*.json']
  },
  etherscan: {
    // apiKey: {
    //   sepolia: process.env.ETHERSCAN_API_KEY as string,
    //   polygonMumbai: process.env.POLYGONSCAN_API_KEY as string,
    //   arbitrumSepolia: process.env.ARBITRUMSCAN_API_KEY as string
    //   // arbitrumTestnet: process.env.ARBITRUMSCAN_API_KEY as string
    // }
    apiKey: process.env.ETHERSCAN_API_KEY as string
  },
  // etherscan: {
  //   apiKey: {
  //     // arbitrumSepolia: process.env.ARBITRUMSCAN_API_KEY as string
  //     arbitrumSepolia: "NW8YIPUKMU92RE8USZNZ7I2D31V4RWY7S8" as string
  //   },
  //   customChains: [
  //     {
  //       network: "arbitrumSepolia",
  //       chainId: 421614,
  //       urls: {
  //         apiURL: ARBITRUM_SEPOLIA_RPC_URL as string,
  //         browserURL: "https://sepolia.arbiscan.io"
  //       }
  //     }
  //   ]
  // },
  // sourcify: {
  //   // Disabled by default
  //   // Doesn't need an API key
  //   enabled: true
  // },
  contractSizer: {
    // alphaSort: true,
    // disambiguatePaths: false,
    runOnCompile: false,
    // strict: true,
    // only: [':ERC20$'],
  },
  gasReporter:{
    enabled: false
  }
  // paths: {
  //   sources: './contracts',
  //   tests: './test',
  //   cache: './cache',
  //   artifacts: './artifacts'
  // },
};

export default config;
