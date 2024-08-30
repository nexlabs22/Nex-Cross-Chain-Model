import { addressMapType } from "@/types/generalTypes"

export const zeroAddress = '0x0000000000000000000000000000000000000000'

export const goerliWethAddress = '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6'
export const sepoliaWethAddress = '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14'
export const goerliUsdtAddress = '0x636b346942ee09Ee6383C22290e89742b55797c5'
export const sepoliaUsdtAddress = '0xE8888fE3Bde6f287BDd0922bEA6E0bF6e5f418e7'
export const sepoliaDianariUsdcAddress = '0x709CE4CB4b6c2A03a4f938bA8D198910E44c11ff'
export const goerliLinkAddress = '0x326C977E6efc84E512bB9C30f76E30c160eD06FB'
export const sepoliaLinkAddress = '0x779877A7B0D9E8603169DdbD7836e478b4624789'

export const MainnetUniswapV3FactoryAddress = '0x1F98431c8aD98523631AE4a59f267346ea31F984'
export const sepoliaUniswapV3FactoryAddress = '0x0227628f3F023bb0B980b67D528571c95c6DaC1c'

export const goerliAnfiIndexToken = '0x40d284001E3f6501C3f59FA4719776f973Ef6F91'
export const goerliCrypto5IndexToken = '0x63E7c9AD503973059D94EcCc0EB1daFC0fb7497c'

export const goerliAnfiV2IndexToken = '0xE62038e2f4A057b014a840Ea6D9F07d1f5779458'
export const sepoliaAnfiV2IndexToken = '0x5Cd93F5C4ECE56b7faC31ABb3c1933f6a6FE7182'
// export const sepoliaCrypto5V2IndexToken = "0x47Fa73B6E9cFDB28B134D380Ef3f931e77260B24"
export const sepoliaCrypto5V2IndexToken = '0xA16FEC5964aDE6563624C16d0b2EDeC95bEEB63b'
export const mumbaiCrypto5V2Vault = '0x53B8876a23C057630c487D5a7B394EF45e64f2fA'
export const arbitrumSepoliaCrypto5V2Vault = '0x04fddfb8b2EFaEaFc590505ffF0bA67E408d8A01'

// export const sepoliaMAG7IndexTokenAddress = '0x955b3F0091414E7DBbe7bdf2c39d73695CDcDd95'
export const sepoliaMAG7IndexTokenAddress = '0x1e881F3c8bF7A161E884B4D86Fe8810290d3095D'

export const sepoliaArbeiIndexTokenAddress = "0xeCBa11929312420414b6a9a70f206f90789f3069"
export const sepoliaArbeiIndexFactoryAddress = "0xB5f11EAd535622Fa4EA1CA665e38ab2b4B1B2F9B"

export const goerliAnfiFactory = '0x12A1d813f70025366B31B27582af902141b50484'
export const goerliCrypto5Factory = '0x8a5e84A1B5e8640222A6Ae5A20B2740A060acCf4'
export const mumbaiCrypto5V2IndexFactory = '0xe0c7EC4711EEa139Eaa5F04f6549C2dc9b5bF5Cf'

export const goerliAnfiV2Factory = '0xfb5BBb9a17eA7eFf0dA692EF60f961af49345606'
export const sepoliaAnfiV2Factory = '0x7427E998D4db46E15f831e4Cff0393Ebb277c637'
// export const sepoliaCrypto5V2Factory = "0x877E48015097aAeEa3307C309dBc3AABed688Eca"
export const sepoliaCrypto5V2Factory = '0xCd16eDa751CcC77f780E06B7Af9aeD0E90a51586'
export const sepoliaSciV2Factory = '0xCEA2034a33704821f6BB218217A334dC3B5e15Cf'
// export const sepoliaMag7Factory = '0xFA6fefD6616b600aC17A5E42403EBE218Ad210E1'
export const sepoliaMag7FactoryStorage = '0xb9182570054598AC2a457E034f3C0bDfd6c60D73'
export const sepoliaMag7Factory = '0x5EBD4Ac25ADbb238941086b7e2a87672f93919a4'
export const sepoliaMag7FactoryProcessor = '0x8250b30Ae818Ab30d5A03E893Cdc850bdA08E638'

// export const Mag7IndexTokenAddresses: AddressMap = {
//     [`sepolia`]: `0x1e881F3c8bF7A161E884B4D86Fe8810290d3095D`
// };

// export const IndexFactoryStorageAddresses: AddressMap = {
//     [`sepolia`]: `0xb9182570054598AC2a457E034f3C0bDfd6c60D73`
// };

// export const IndexFactoryAddresses: AddressMap = {
//     [`sepolia`]: `0x5EBD4Ac25ADbb238941086b7e2a87672f93919a4`
// };
export type AddressMap = { [blockchain: string]: string };

export const OrderProcessorAddresses: AddressMap = {
    [`sepolia`]: `0xd0d00Ee8457d79C12B4D7429F59e896F11364247`
};

export const IndexFactoryProcessorAddresses: AddressMap = {
    [`sepolia`]: `0x8250b30Ae818Ab30d5A03E893Cdc850bdA08E638`
};


export const mumbaiWmaticAddress = '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889'
export const arbitrumSepoliaWethAddress = '0xE591bf0A0CF924A0674d7792db046B23CEbF5f34'
export const sepoliaCrossChainTokenAddress = '0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05'
export const mumbaiCrossChainTokenAddress = '0xf1E3A5842EeEF51F2967b3F05D45DD4f4205FF40'
export const arbitrumSepoliaCrossChainTokenAddress = '0xA8C0c11bf64AF62CDCA6f93D3769B88BdD7cb93D'

export const sepoliaChainSelector = '16015286601757825753'
export const mumbaiChainSelector = '12532609583862916517'
export const arbitrumSepoliaChainSelector = '3478487238524512106'

export const goerliAnfiNFT = '0x2e4fd30adBB1687F8c2d9e51707E0AbE8679a442'

export const wethAddress = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'

export const goerliUsdtWethPoolAddress = '0xE297447C5fCA561cAC6C1cEDc91Eab74D68dC6eb'
export const goerlianfiPoolAddress = '0xEdFEEeFf1DAF631b4aBC8C021Cff4b1267547eF2'
export const goerliCR5PoolAddress = '0x9329c764A2d8B02b01F5eC8fb6F4BB0a7155cFc0'

export const sepoliaAnfiWethPoolAddress = '0x37214b0039e9b12711e9dbb5420e47d5a35f3aa2'
export const sepoliaCR5WethPoolAddress = '0x3222bd13ba8bf8241a752a6907aeb8d769ebb63b'
export const sepoliaLinkWethPoolAddress = '0xdd7cc9a0da070fb8b60dc6680b596133fb4a7100'
export const sepoliaARBEIWethPoolAddress = '0xab03e6314113e1cfb4bf9737ee2850f1318561ed'
export const sepoliaMAG7WethPoolAddress = '0x3dB55b9fD6E407140E568e7F902aF9a3472Ec882'

export const goerliLinkWethPoolAddress = '0x4Cff90F02897259E1aB69FF6bbD370EA14529bD8' // LINK/WETH Pool Address Needs to be replaced with CRYPTO5/WETH Pool Address

export const sepoliaTokenFaucet = '0x5Efe973Bc615112Bca43696483bd53Ce86E2B0ab'
export const sepoliaCR5FactoryStorage = '0x0fDB8A708E4Ab28DB78E0897Fc6bf3aF79Ef2271'

export const arbtirumSepoliaCR5CrossChainFactory = '0xeB08A8CA65Bc5f5dD4D54841a55bb6949fab3548'

export const crypto5PoolAddress = '0xa6cc3c2531fdaa6ae1a3ca84c2855806728693e8' // LINK/WETH Pool Address Needs to be replaced with CRYPTO5/WETH Pool Address

export const exchangeAddresses: addressMapType = {
	bitfinex: zeroAddress,
	bybit: zeroAddress,
}

export const factoryAddresses: addressMapType = { ANFI: sepoliaAnfiV2Factory, CRYPTO5: sepoliaCrypto5V2Factory, MAG7: sepoliaMag7Factory, ARBEI: sepoliaArbeiIndexFactoryAddress }
export const goerliTokenAddresses: addressMapType = { ANFI: goerliAnfiIndexToken, CRYPTO5: goerliCrypto5IndexToken, USDT: goerliUsdtAddress, ETH: goerliWethAddress }
export const sepoliaTokenAddresses: addressMapType = {
	ANFI: sepoliaAnfiV2IndexToken,
	CRYPTO5: sepoliaCrypto5V2IndexToken,
	USDT: sepoliaUsdtAddress,
	USDC: sepoliaDianariUsdcAddress,
	ETH: sepoliaWethAddress,
	ARBEI: sepoliaArbeiIndexTokenAddress,
	MAG7: sepoliaMAG7IndexTokenAddress,
}
export const sepoliaIndexTokenAddresses: addressMapType = {
	ANFI: sepoliaAnfiV2IndexToken,
	CRYPTO5: sepoliaCrypto5V2IndexToken,
	MAG7: sepoliaMAG7IndexTokenAddress,
	ARBEI: sepoliaArbeiIndexTokenAddress,
}
export const sepoliaIndexPoolAddresses: addressMapType = {
	ANFI: sepoliaAnfiWethPoolAddress,
	CRYPTO5: sepoliaCR5WethPoolAddress,
	ARBEI: sepoliaARBEIWethPoolAddress,
	MAG7: sepoliaMAG7WethPoolAddress,
}
