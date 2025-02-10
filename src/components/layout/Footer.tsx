import { Stack, Typography, Link } from "@mui/material";
import Image from "next/image";

import logo from '@/assets/images/logo.webp'

import LinkedInIcon from '@mui/icons-material/LinkedIn';
import XIcon from '@mui/icons-material/X';
import GitHubIcon from '@mui/icons-material/GitHub';
import { FaMedium } from "react-icons/fa6";

const Footer = () => {
    return (
        <Stack width={'100%'}>
            <Stack width={'100%'} direction={{ xs: 'column', lg: 'row' }} alignItems={'start'} justifyContent={{ xs: 'start', lg: 'space-between' }} paddingY={{ xs: 4, lg: 4 }}>
                <Stack width={{ xs: '100%', lg: '25%' }} height={'100%'} gap={3}>
                    <Stack gap={0.5}>
                        <Stack direction={'row'} alignItems={'center'} gap={1}>
                            <Image src={logo} alt="NexLabs Nex Labs logo xlogo" height={34} width={34} style={{
                                filter: 'brightness(0) invert(1)'
                            }} />
                            <Typography variant="h2">NexLabs</Typography>
                        </Stack>
                        <Typography variant="subtitle1" lineHeight={1.4} width={{xs: '100%', sm: '50%', lg: '90%'}}>Bring real-world assets (RWAs) on-chain and simplifying the investing process for users.</Typography>
                    </Stack>
                    <Stack direction={'row'} gap={2} marginBottom={{xs: 2, lg: 0}}>
                        <Link href="https://www.linkedin.com/company/nex-labs/" target="_blank" underline="none">
                            <LinkedInIcon color="primary" />
                        </Link>
                        <Link href="https://twitter.com/NEX_Protocol" target="_blank" underline="none">
                            <XIcon color="primary" />
                        </Link>
                        <Link href="https://nexlabs.medium.com/" target="_blank" underline="none">
                            <FaMedium color="primary" size={24} />
                        </Link>
                        <Link href="https://github.com/nexlabs22" target="_blank" underline="none">
                            <GitHubIcon color="primary" />
                        </Link>
                    </Stack>
                </Stack>
                <Stack width={{ xs: '100%', lg: '75%' }} height={'100%'} direction={{ xs: 'row', sm: 'row', lg: 'row' }} gap={{xs: 4, lg: 10}} justifyContent={{xs: 'space-between', sm: 'start', lg: 'end'}} marginTop={{xs: 4, lg: 0}} >
                    <Stack gap={3}>
                        <Typography variant="h5">About Nex</Typography>
                        <Stack gap={2}>
                            <Link href="https://app.nexlabs.io/" target="_blank" underline="none">
                                <Typography variant="body1">dApp</Typography>
                            </Link>
                            <Link href="https://github.com/nexlabs22/%E2%80%A6ices-Model-Contracts" target="_blank" underline="none">
                                <Typography variant="body1">Public repository</Typography>
                            </Link>
                            <Link href="https://nex-labs.gitbook.io/nex-dex/" target="_blank" underline="none">
                                <Typography variant="body1">Whitepaper</Typography>
                            </Link>
                            <Link href="https://www.nexlabs.io/license" target="_blank" underline="none">
                                <Typography variant="body1">Licences</Typography>
                            </Link>
                        </Stack>
                    </Stack>
                    <Stack gap={3}>
                        <Typography variant="h5">Whitepaper pieces</Typography>
                        <Stack gap={2}>
                            <Link href="https://nex-labs.gitbook.io/nex-dex/spot-indices/nex-labs-spot-index-standard-model" target="_blank" underline="none">
                                <Typography variant="body1">Spot - Indices</Typography>
                            </Link>
                            <Link href="https://nex-labs.gitbook.io/nex-dex/" target="_blank" underline="none">
                                <Typography variant="body1">Protocol Structure</Typography>
                            </Link>
                            <Link href="https://nex-labs.gitbook.io/nex-dex/token-and-smart-contract-details/address-and-ticker" target="_blank" underline="none">
                                <Typography variant="body1">Token & Smart contract details</Typography>
                            </Link>
                            <Link href="https://nex-labs.gitbook.io/nex-dex/additional-information/roadmap" target="_blank" underline="none">
                                <Typography variant="body1">Roadmap</Typography>
                            </Link>
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>
            <Stack display={{ xs: 'none', lg: 'flex' }} width={'100%'} direction={'row'} alignItems={'center'} justifyContent={'center'} paddingTop={6} gap={{ xs: 1, lg: 2 }} position={'relative'} zIndex={10}>
                <Link href="/terms_and_conditions" target="_blank" underline="none">
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>Terms & Conditions</Typography>
                </Link>
                |
                <Link href="privacy_policy" target="_blank" underline="none">
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>Privacy Policy</Typography>
                </Link>
            </Stack>
        </Stack>
    )
}

export default Footer;

