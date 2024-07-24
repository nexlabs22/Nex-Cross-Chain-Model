import { goerliAnfiV2IndexToken, goerliCrypto5IndexToken, sepoliaAnfiV2IndexToken, sepoliaARBIndexTokenAddress, sepoliaCrypto5V2IndexToken, sepoliaMAG7IndexTokenAddress, sepoliaSciV2IndexToken, zeroAddress } from "./contractAddresses";
import anfiLogo from '@assets/images/anfi.png'
import cr5Logo from '@assets/images/cr5.png'
import mag7 from '@assets/images/mag7.png'
import sciLogo from '@assets/images/sci.png'
import arbLogo from '@assets/images/arb.png'

export const nexTokens = [
    {
        symbol: 'ANFI',
        shortName: 'ANFI',
        indexType: 'defi',
        address: sepoliaAnfiV2IndexToken,
        decimals: 18,
        logo:anfiLogo.src
    },
    {
        symbol: 'CRYPTO5',
        shortName: 'CR5',
        indexType: 'crosschain',
        address: sepoliaCrypto5V2IndexToken,
        decimals: 18,
        logo: cr5Logo.src
    },
    {
        symbol: 'MAG7',
        shortName: 'MAG7',
        indexType: 'crosschain',
        address: sepoliaMAG7IndexTokenAddress,
        decimals: 18,
        logo: mag7.src
    },
    {
        symbol: 'ARBEI',
        shortName: 'ARBEI',
        indexType: 'defi',
        address: sepoliaARBIndexTokenAddress,
        decimals: 18,
        logo: arbLogo.src
    },
]