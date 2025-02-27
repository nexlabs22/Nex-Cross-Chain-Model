import {
  TokenAddressMap,
  PoolAddressMap,
  ChainSelectorMap,
} from "@/types/indexTypes"

export const tokenAddresses: TokenAddressMap = {
  WETH: {
    Ethereum: {
      Mainnet: {
        token: { address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" },
        factory: { address: "0x1F98431c8aD98523631AE4a59f267346ea31F984" },
      },
      Sepolia: {
        token: { address: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14" },
      },
    },
    Arbitrum: {
      Mainnet:{
        token: { address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1" }
      },
      Sepolia: {
        token: { address: "0xE591bf0A0CF924A0674d7792db046B23CEbF5f34" },
      },
    },
  },
  USDT: {
    Ethereum: {
      Mainnet: {
        token: { address: "0xdAC17F958D2ee523a2206206994597C13D831ec7" },
      },
      Sepolia: {
        token: { address: "0xE8888fE3Bde6f287BDd0922bEA6E0bF6e5f418e7" },
        faucet: { address: "0xf7043384e395306de8356e486679e3EfAD1a6609" },
      },
    },
    Arbitrum:{
      Mainnet:{
        token: {address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9"}
      }
    }
  },
  USDC: {
    Ethereum: {
      Sepolia: {
        token: { address: "0x1c7d4b196cb0c7b01d743fbc6116a902379c7238", decimals: 6 },
        dinari: { address: "0x709CE4CB4b6c2A03a4f938bA8D198910E44c11ff", decimals: 6 },
        faucet: { address: "0xf7043384e395306de8356e486679e3EfAD1a6609" }
      },
    },
    Arbitrum:{
      Mainnet:{
        token: { address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', decimals: 6},
        faucet: { address: "0xf7043384e395306de8356e486679e3EfAD1a6609" }
      }
    }
  },
  LINK: {
    Ethereum: {
      Sepolia: {
        token: { address: "0x779877A7B0D9E8603169DdbD7836e478b4624789" },
      },
    },
  },
  ANFI: {
    Ethereum: {
      Mainnet: {
        vault: { address: "0x95e9FB1be73AAED5DaEfa504A77E59F5174552b3" },
        factory: { address: "0xE2fBE16888dED5616934E603f6f03CFD8486140b" },
        storage: { address: "0xE3Aa4bFBe8FEfD04C1bB3d01Cedf683a113e13d5" },
      },
      Sepolia: {
        token: { address: "0xD01eA42518fcCf1d6D1A12ceD4fEBCE6bc19d4d7" },
        factory: { address: "0x722e226f39e68889603f3BD758b5bF1c23683b59" },
        storage: { address: "0x694cC7E980CBc450C18cF5D719D63cD9D01d5497" },
        ccip: { address: "0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05" },
        functions_oracle: { address: "0xa192d894681bC286C59bdAB101d08fe45d89E552" },
      },
    },
    Arbitrum: {
      Mainnet: {
        token: { address: "0x41Fecfb0E330E5FE13452B80049127991248345C" },
        factory: { address: "0x6a41A7431556B5F14a3c0872175302B7A5B4D110" },
        storage: { address: "0x8Dcb7aAe8486dEC33729a4bf15906646693af191" },
        functions_oracle: { address: "0x21B15A5c6829d62ca93aa1c8db837D5A7A0e7187"}
      },
      Sepolia: {
        vault: { address: "0x70195bd938bb6F558D8d688D4A45335e073d20Af" },
        factory: { address: "0x7C846a936c512D56B60e0Ec285dE091c369c61C4" },
        storage: { address: "0x4Fd9D5C4Bb077eBf39B8Ad4F71576D3CE32bf168" },
        ccip: {address: "0xA8C0c11bf64AF62CDCA6f93D3769B88BdD7cb93D"}
      },
    }
  },
  CRYPTO5: {
    Ethereum: {
      Sepolia: {
        token: { address: "0x4F96a57451A045b016B17D634727FB03f95c3fed" },
        factory: { address: "0xc9111A8ad0AB1426533518463Aa175A251e571e7" },
        storage: { address: "0x1DBde877b2Fa4106D944386BF0E8b92D1Fb69D8F" },
        ccip: { address: "0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05" },
        functions_oracle: {address: "0xeB5bBC63C3B90E9ff22D85E2da5f1fBB2339FAc0"}
      },
    },
    Binance:{
      Mainnet:{
        vault: {address: "0x963Da1C59Ed32a36451CeCA761A3e0f5f9C333d9"},
        factory: {address: "0xFE501505DA469ff0134D9e3d9dA27674A92c3234"},
        storage: {address: "0x8e977fE53f4cDDBDdB69664027253b7d7f362971"}
      }
    },
    Arbitrum: {
      Mainnet: {
        token: { address: "0xdA184FC12cCe81dF499561E88f3d9a06cb229dfC" },
        factory: { address: "0xA00be13EbfaCa5ADB3780096F88dEA42d6a021c8" },
        storage: { address: "0x3CE7E36B62e2F26E4427dB7112d4E4aE9D3CF5C4" },
      },
      Sepolia: {
        factory: { address: "0x66531Bc6205573F962aB4d0F26Eb75C8bC8Aea1B" },
        vault: { address: "0xAd47d2ba2c05ada5B15F84F6EfFA8f37BE63Bd6E" },
        storage: { address: "0x54D331905CD37Eb2e47F0dE3DD24A5cC869853d5" },
        ccip: {address: "0xA8C0c11bf64AF62CDCA6f93D3769B88BdD7cb93D"}
      },
    },
  },
  MAG7: {
    Ethereum: {
      Sepolia: {
        token: { address: "0x1e881F3c8bF7A161E884B4D86Fe8810290d3095D" },
        factory: { address: "0x5EBD4Ac25ADbb238941086b7e2a87672f93919a4" },
        storage: { address: "0xb9182570054598AC2a457E034f3C0bDfd6c60D73" },
        processor: { address: "0x8250b30Ae818Ab30d5A03E893Cdc850bdA08E638" },
      },
    },
    Arbitrum: {
      Mainnet: {
        token: { address: "0x4386741db5Aadec9201c997b9fD197b598ef1323" }, //ARBEI
        factory: { address: "0xC261547547fb4b108db504FE200e20Db7612D5E9" }, //ARBEI
        storage: { address: "0xB1ae3b1A08cf98f7e02342F8adD29b86021B1632" }, // ARBEI
        processor: { address: "0xB1ae3b1A08cf98f7e02342F8adD29b86021B1632" }, // ARBEI
      },
    }
  },
  ARBEI: {
    Ethereum: {
      Sepolia: {
        token: { address: "0x66B13DbCC6B107668f46174d0964030f103C3D3a" },
        factory: { address: "0xdB3EB6589B99439d549E8d2c089F42aB2954d9c0" },
        storage: { address: "0xE7678443f01D4bf1032105F27bd8d08C3d4E11e0" },
      },
    },
    Arbitrum: {
      Mainnet: {
        token: { address: "0x4386741db5Aadec9201c997b9fD197b598ef1323" },
        factory: { address: "0xC261547547fb4b108db504FE200e20Db7612D5E9" },
        storage: { address: "0xB1ae3b1A08cf98f7e02342F8adD29b86021B1632" },
      },
    }
  },
};


export const poolAddresses: PoolAddressMap = {
  ANFI: {
    THETER: {
      Ethereum: {        
        Sepolia: "0x37214b0039e9b12711e9dbb5420e47d5a35f3aa2",
      },
    },
  },
  CRYPTO5: {
    WETH: {
      Ethereum: {        
        Sepolia: "0x3222bd13ba8bf8241a752a6907aeb8d769ebb63b",
      },
    },
    USDC: {
      Ethereum: {
        Sepolia: "0x709CE4CB4b6c2A03a4f938bA8D198910E44c11ff",
      },
    },
  },
  LINK: {
    WETH: {
      Ethereum: {        
        Sepolia: "0xdd7cc9a0da070fb8b60dc6680b596133fb4a7100",
      },
    },
  },
  ARBEI: {
    WETH: {
      Arbitrum: {
        Sepolia: "0xab03e6314113e1cfb4bf9737ee2850f1318561ed",
      },
    },
  },
  MAG7: {
    WETH: {
      Ethereum: {
        Sepolia: "0x3dB55b9fD6E407140E568e7F902aF9a3472Ec882",
      },
    },
  }
}

export const factoryAddresses = {
  UNISWAP: {
    Ethereum: {
      Mainnet: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
      Sepolia: "0x0227628f3F023bb0B980b67D528571c95c6DaC1c",
    },
    Arbitrum:{
      Mainnet: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
    }
  }
}
// export const factoryAddresses = {
//   Ethereum: {
//     Mainnet: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
//     Sepolia: "0x0227628f3F023bb0B980b67D528571c95c6DaC1c",
//   },
//   Polygon: {
//     Mumbai: "0xe0c7EC4711EEa139Eaa5F04f6549C2dc9b5bF5Cf",
//   },
//   Arbitrum: {
//     Sepolia: "0xB5f11EAd535622Fa4EA1CA665e38ab2b4B1B2F9B",
//   },
// }

export const chainSelectorAddresses: ChainSelectorMap = {
  Ethereum: {    
    Sepolia: "16015286601757825753",
  },
  Arbitrum: {
    Sepolia: "3478487238524512106",
    Mainnet: "4949039107694359620",
  },
}
