import { Stack, Box, IconButton, Badge } from "@mui/material";
import { ConnectButton, useActiveWallet } from "thirdweb/react";
import { client } from "@/utils/thirdWebClient";
import { IoWalletOutline } from "react-icons/io5";
import theme from '@/theme/theme'

const MobileConnectWallet = () => {

    const wallet = useActiveWallet();

    return (
        <Box display={'block'} position={'relative'} overflow={'hidden'}>
            {
                !wallet ? (
                    <IconButton sx={{
                        position: 'relative',
                        top: 0,
                        right: 0,
                        zIndex: 1
                    }}>
                        <IoWalletOutline size={32} color={theme.palette.info.main} />
                    </IconButton>
                ) : (
                    <Badge
                        color="success"
                        variant="dot"
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        sx={{
                            '& .MuiBadge-badge': {
                                right: '25%',
                                bottom: '25%',
                                height: '.6rem',
                                width: '.6rem',
                                borderRadius: '50%'
                            }
                        }}
                    >
                        <IconButton sx={{
                            position: 'relative',
                            top: 0,
                            right: 0,
                            zIndex: 1
                        }}>
                            <IoWalletOutline size={32} color={theme.palette.info.main} />
                        </IconButton>
                    </Badge>

                )
            }
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