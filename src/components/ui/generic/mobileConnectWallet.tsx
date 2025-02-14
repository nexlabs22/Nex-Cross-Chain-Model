import { Stack, Box, IconButton } from "@mui/material";
import { ConnectButton } from "thirdweb/react";
import { client } from "@/utils/thirdWebClient";
import { IoWalletOutline } from "react-icons/io5";
import theme from '@/theme/theme'

const MobileConnectWallet = () => {
    return (
        <Box display={'block'} position={'relative'} overflow={'hidden'}>
            <IconButton sx={{
                position: 'relative',
                top: 0,
                right: 0,
                zIndex: 1
            }}>
                <IoWalletOutline size={32} color={theme.palette.info.main} />
            </IconButton>
            <Stack position={'absolute'} zIndex={2} sx={{
                opacity: 0,
                top: 0,
                left: 0,
                maxWidth: 32
            }}>
                <ConnectButton
                    client={client}
                    connectButton={{ label: "Connect Wallet" }}
                />
            </Stack>
        </Box>
    )
}

export default MobileConnectWallet