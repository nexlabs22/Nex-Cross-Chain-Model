// import theme from "@/theme/theme";
import { Stack } from "@mui/material";

// assets
import MobileMenu from "./mobileMenu";
import { ConnectButton } from "thirdweb/react";
import { client } from "@/utils/thirdWebClient";
import theme from "@/theme/theme";

const ConnectWallet = () => {
    return (
        <Stack direction={'row'} gap={0.5} justifyContent={'end'} alignItems={'center'} sx={{
            '& .tw-connect-wallet': {
                backgroundColor: `${theme.palette.brand.nex1.main} !important`,
                color: `${theme.palette.info.main} !important`,
                borderRadius: '0.4rem !important',
                paddingX: '.4rem !important',
                paddingY: '.6rem !important',
                fontSize: '1rem !important',
                width: 'fit-content !important',
                height: 'fit-content !important',
                fontWeight: '500 !important',
                textTransform: 'none !important',
                display: { xs: "none", lg: "block" },
            }
        }}>
            <ConnectButton
                client={client}
                connectButton={{ label: "Connect Wallet" }}
            />
            <Stack direction={'row'} gap={0.5} display={{ xs: 'flex', lg: 'none' }} justifyContent={'end'} alignItems={'center'}>
                <MobileMenu />
            </Stack>
        </Stack>
    )
}

export default ConnectWallet;