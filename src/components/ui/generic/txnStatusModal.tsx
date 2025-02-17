import { Button, IconButton, Stack, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Image from 'next/image';
import theme from '@/theme/theme';
import { IoMdClose } from "react-icons/io";
import success from '@/assets/images/success.webp'
import failed from '@/assets/images/failed.webp'
import pending from '@/assets/images/pending.webp'
import { MdOutlineArrowOutward } from "react-icons/md";

export default function TxnStatusModal({
    open,
    onClose,
    url,
    type
}:
    {
        open: boolean;
        onClose: () => void;
        url: string;
        type: 'success' | 'failed' | 'pending'
    }) {
    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "start",
                    alignItems: "center",
                    backgroundColor: theme.palette.elevations.elevation900.main,
                    width: { xs: "90vw", md: "50vw", lg: "25vw" },
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    padding: 2,
                    borderRadius: '1rem',
                    overflow: "hidden",
                }}
            >
                <Stack
                    width="100%"
                    direction="row"
                    justifyContent="end"
                    alignItems="center"
                >
                    <IconButton
                        onClick={onClose}
                        sx={{
                            padding: 0,
                            margin: 0,
                        }}
                    >
                        <IoMdClose size={24} color={theme.palette.info.main} />
                    </IconButton>
                </Stack>
                {
                    type === 'success' ? (
                        <Image src={success} alt="success" width={300} height={115} />
                    ) : type === 'failed' ? (
                        <Image src={failed} alt="success" width={300} height={115} />
                    ) : (
                        <Image src={pending} alt="success" width={300} height={115} />
                    )
                }
                
                <Typography variant="h5" color={type === 'success' ? theme.palette.success.main : type === 'failed' ? theme.palette.error.main : theme.palette.warning.main} marginTop={4} marginBottom={2}>
                    {type === 'success' ? 'Successful Transaction!' : type === 'failed' ? 'Failed Transaction!' : 'Pending Transaction'}
                </Typography>
                <Typography variant="body1" color={theme.palette.info.main} marginBottom={2}>
                    {type === 'success' ? 'Your transaction has been successful.' : type === 'failed' ? 'Your transaction has failed.' : 'Your transaction is pending...'}
                </Typography>

                <Button onClick={() => {if(window) window.open(url, '_blank')}} sx={{
                    backgroundColor: 'transparent',
                    '&:hover':{
                        backgroundColor: 'transparent'
                    }
                }}>
                    <Stack direction="row" alignItems="center" gap={0.5}>
                        <Typography variant="caption" color={type === 'success' ? theme.palette.success.main : type === 'failed' ? theme.palette.error.main : theme.palette.info.main}>
                            View on Etherscan
                        </Typography>
                        <MdOutlineArrowOutward size={20} color={type === 'success' ? theme.palette.success.main : type === 'failed' ? theme.palette.error.main : theme.palette.info.main} />
                    </Stack>
                </Button>
            </Box>
        </Modal>
    )
}