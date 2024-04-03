import { goerliAnfiV2IndexToken, goerliCrypto5IndexToken, sepoliaAnfiV2IndexToken, sepoliaCrypto5V2IndexToken } from "./contractAddresses";
import anfiLogo from '@assets/images/anfi.png'
import cr5Logo from '@assets/images/cr5.png'

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
    }
]