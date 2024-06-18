import { goerliAnfiV2IndexToken, goerliCrypto5IndexToken, sepoliaAnfiV2IndexToken, sepoliaCrypto5V2IndexToken, sepoliaSciV2IndexToken, zeroAddress } from "./contractAddresses";
import anfiLogo from '@assets/images/anfi.png'
import cr5Logo from '@assets/images/cr5.png'
import mag7 from '@assets/images/MAG7.jpg'
import sciLogo from '@assets/images/sci.png'

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
        address: zeroAddress,
        decimals: 18,
        logo: mag7.src
    },
    // {
    //     symbol: 'SCI',
    //     shortName: 'SCI',
    //     indexType: 'defi',
    //     address: sepoliaSciV2IndexToken,
    //     decimals: 18,
    //     logo: sciLogo.src
    // },
]