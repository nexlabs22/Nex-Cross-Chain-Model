
import { Stack, Box, Typography, Button, Grid } from "@mui/material";

import { useLandingPageStore } from '@/store/store'


import 'react-circular-progressbar/dist/styles.css';

import {  BsInfoCircle } from "react-icons/bs";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


import { CiStickyNote } from "react-icons/ci";
import { useStaking } from "@/providers/StakingProvider";
import { FormatToViewNumber } from "@/hooks/math";
import GenericTooltip from "../GenericTooltip";

const Tooltip: React.FC = () => {

    const { selectedStakingIndex, chartLineColorMapping} = useStaking()

    return (
        <span>
        <GenericTooltip
            color={chartLineColorMapping[selectedStakingIndex?.symbol!]}
            content={
                <div>
                    <p className="text-whiteText-500 text-sm interMedium">
                    Pool share is the percentage of the total pool size staked by the user.
                    </p>
                </div>
            }
        >
            <BsInfoCircle color={chartLineColorMapping[selectedStakingIndex?.symbol!]} size={14} className="cursor-pointer" />
        </GenericTooltip>
    </span>
    )
}


const StakingLeaderBoard: React.FC = () => {

    const { theme } = useLandingPageStore()
    const { selectedStakingIndex, leaderBoardData} = useStaking()    
    const index = selectedStakingIndex?.symbol

    return (
        <Stack width={"100%"} height={"fit-content"} direction={"column"} alignItems={"start"} justifyContent={"start"} borderRadius={"1.2rem"}>
            <TableContainer component={Paper} sx={{borderRadius: "1.2rem", maxHeight: "80vh", overflowY: "auto", boxShadow: "0px 0.5px 5px 1px #484848"}}>
                <Table stickyHeader >
                    <TableHead sx={{
                        backgroundColor: "rgba(38,38,38,0.5)"
                    }}>
                        <TableRow sx={{
                        backgroundColor: "rgba(38,38,38,0.5)"
                    }}>
                            <TableCell><Typography variant="subtitle2">Rank</Typography></TableCell>
                            <TableCell><Typography variant="subtitle2">Public Key</Typography></TableCell>
                            <TableCell align="center" sx={{ paddingX: 1, verticalAlign: 'middle' }}><Typography variant="subtitle2">Total {index} Staked*</Typography></TableCell>
                            <TableCell align="center" sx={{ paddingX: 1, verticalAlign: 'middle' }}><Typography variant="subtitle2">Reward* </Typography></TableCell>
                            <TableCell align="center" sx={{ paddingX: 1, verticalAlign: 'middle' }}><Box sx={{ display: 'inline-flex', alignItems: 'center', gap:1 }}><Typography variant="subtitle2">Pool share</Typography><Tooltip /></Box></TableCell>
                            <TableCell align="center" sx={{ paddingX: 1, verticalAlign: 'middle', zIndex:1 }}><Typography variant="subtitle2">Last Activity</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            leaderBoardData.map((row, key) => {
                                return (
                                    <TableRow key={key} sx={{ '&:last-child td, &:last-child th': { border: 0 }, paddingX: 1 }}>
                                        <TableCell>
                                            <Typography variant="caption">#{key+1}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="caption">{row.user}</Typography>
                                        </TableCell>
                                        <TableCell align="center" sx={{ paddingX: 1, verticalAlign: 'middle' }}>
                                            <Typography variant="caption">{FormatToViewNumber({value:row.totalStakeAmount, returnType:'currency'})}</Typography>
                                        </TableCell>
                                        <TableCell align="center" sx={{ paddingX: 1, verticalAlign: 'middle' }}>
                                            <Typography variant="caption">{FormatToViewNumber({value:row.rewardAmount, returnType:'currency'})}</Typography>
                                        </TableCell>
                                        <TableCell align="center" sx={{ paddingX: 1, verticalAlign: 'middle' }}>
                                            <Typography variant="caption">{FormatToViewNumber({value:row.userPoolSharePercentage, returnType:'percent'})}</Typography>
                                        </TableCell>
                                        <TableCell align="center" sx={{ paddingX: 1, verticalAlign: 'middle' }}>
                                            <Typography variant="caption">{row.lastActivityString}</Typography>
                                        </TableCell>

                                        
                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>
                </Table>

            </TableContainer>
        </Stack>
    )
}

export default StakingLeaderBoard