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
      Goerli: {
        token: { address: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6" },
      },
      Sepolia: {
        token: { address: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14" },
      },
    },
    Arbitrum: {
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
      Goerli: {
        token: { address: "0x636b346942ee09Ee6383C22290e89742b55797c5" },
      },
      Sepolia: {
        token: { address: "0xE8888fE3Bde6f287BDd0922bEA6E0bF6e5f418e7" },
        faucet: { address: "0xf7043384e395306de8356e486679e3EfAD1a6609" },
      },
    },
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
        token: { address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', decimals: 6}
      }
    }
  },
  LINK: {
    Ethereum: {
      Goerli: {
        token: { address: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB" },
      },
      Sepolia: {
        token: { address: "0x779877A7B0D9E8603169DdbD7836e478b4624789" },
      },
    },
  },
  MATIC: {
    Polygon: {
      Mumbai: {
        token: { address: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889" },
      },
    },
  },
  ANFI: {
    Ethereum: {
      Mainnet: {
        token: { address: "0x40d284001E3f6501C3f59FA4719776f973Ef6F91" },
        factory: { address: "0x12A1d813f70025366B31B27582af902141b50484" },
        storage: { address: "0x12A1d813f70025366B31B27582af902141b50484" },
      },
      Goerli: {
        token: { address: "0x40d284001E3f6501C3f59FA4719776f973Ef6F91" },
        factory: { address: "0xfb5BBb9a17eA7eFf0dA692EF60f961af49345606" },
      },
      Sepolia: {
        token: { address: "0x5Cd93F5C4ECE56b7faC31ABb3c1933f6a6FE7182" },
        factory: { address: "0x7427E998D4db46E15f831e4Cff0393Ebb277c637" },
        storage: { address: "0x7427E998D4db46E15f831e4Cff0393Ebb277c637" },
      },
    },
  },
  CRYPTO5: {
    Ethereum: {
      Goerli: {
        token: { address: "0x63E7c9AD503973059D94EcCc0EB1daFC0fb7497c" },
        factory: { address: "0x8a5e84A1B5e8640222A6Ae5A20B2740A060acCf4" },
      },
      Sepolia: {
        token: { address: "0xA16FEC5964aDE6563624C16d0b2EDeC95bEEB63b" },
        factory: { address: "0xCd16eDa751CcC77f780E06B7Af9aeD0E90a51586" },
        storage: { address: "0x0fDB8A708E4Ab28DB78E0897Fc6bf3aF79Ef2271" },
        ccip: { address: "0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05" },
      },
    },
    Polygon: {
      Mumbai: {
        factory: { address: "0xe0c7EC4711EEa139Eaa5F04f6549C2dc9b5bF5Cf" },
        storage: { address: "0x53B8876a23C057630c487D5a7B394EF45e64f2fA" },
      },
    },
    Arbitrum: {
      Sepolia: {
        factory: { address: "0xeB08A8CA65Bc5f5dD4D54841a55bb6949fab3548" },
        vault: { address: "0x04fddfb8b2EFaEaFc590505ffF0bA67E408d8A01" },
        ccip: { address: "0xA8C0c11bf64AF62CDCA6f93D3769B88BdD7cb93D" },
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
        Goerli: "0xEdFEEeFf1DAF631b4aBC8C021Cff4b1267547eF2",
        Sepolia: "0x37214b0039e9b12711e9dbb5420e47d5a35f3aa2",
      },
    },
  },
  CRYPTO5: {
    WETH: {
      Ethereum: {
        Goerli: "0x9329c764A2d8B02b01F5eC8fb6F4BB0a7155cFc0",
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
        Goerli: "0x4Cff90F02897259E1aB69FF6bbD370EA14529bD8",
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
  },
  MATIC: {
    WETH: {
      Polygon: {
        Mumbai: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
      },
    },
  },
}

export const factoryAddresses = {
  UNISWAP: {
    Ethereum: {
      Mainnet: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
      Sepolia: "0x0227628f3F023bb0B980b67D528571c95c6DaC1c",
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
    Mumbai: "12532609583862916517",
    Sepolia: "16015286601757825753",
  },
  Arbitrum: {
    Sepolia: "3478487238524512106",
  },
}
