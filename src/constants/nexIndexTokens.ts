import { goerliAnfiV2IndexToken, goerliCrypto5IndexToken } from "./contractAddresses";
import anfiLogo from '@assets/images/anfi.png'
import cr5Logo from '@assets/images/cr5.png'

export const nexTokens = [
    {
        symbol: 'ANFI',
        shortName: 'ANFI',
        address: goerliAnfiV2IndexToken,
        decimals: 18,
        logo:anfiLogo.src
    },
    {
        symbol: 'CRYPTO5',
        shortName: 'CR5',
        address: goerliCrypto5IndexToken,
        decimals: 18,
        logo: cr5Logo.src
    }
]