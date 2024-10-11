import Image from "next/image";
import Link from "next/link";

import { Stack, Box, Typography, Button, Grid } from "@mui/material";
import Divider from '@mui/material/Divider';
import { useLandingPageStore } from '@/store/store'

import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import { BsArrowRight } from "react-icons/bs";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import anfiLogo from '@assets/images/anfi.png'
import cr5Logo from '@assets/images/cr5.png'
import mag7Logo from '@assets/images/mag7.png'
import arbLogo from '@assets/images/arb.png'

import { CiStickyNote } from "react-icons/ci";
import { useStaking } from "@/providers/StakingProvider";
import { FormatToViewNumber } from "@/hooks/math";

function createData(
    PK: string,
    currentBalance: number,
    income1day: number,
    income7days: number,
    income30days: number,
    totalIncome: number
) {
    return { PK, currentBalance, income1day, income7days, income30days };
}

const dataRows = [
    createData('0x7C2481b219AE3eC7f4e824A904AE6dA8C0a08LcS', 47852.86, 125.72, 842.32, 2452.34, 6278.92),
    createData('bc1qY78s3JndaJFnidjsa8D3JnAJs82D34', 72341.56, 873.21, 42.78, 1.93, 0.10),
    createData('1BvMN23JFnidjsaJFN823Jnda8D32JnA', 34812.98, 123.78, 65.43, 4.21, 0.32),
    createData('0xWqER7Cn823JBYfq9XFUjLqCnbiKYUd3J', 98721.34, 567.89, 98.34, 7.54, 0.87),
    createData('3sNHD21oifjdajFnidjsaJFN8D23JndaJ', 12547.21, 341.90, 21.08, 1.23, 0.45),
    createData('bc1qY45JFnidjsa823JndaJFN8D32KJs8D', 58231.78, 901.23, 72.98, 5.32, 0.67),
  
];


const StakingLeaderBoard: React.FC = () => {

    const { theme } = useLandingPageStore()
    const { selectedStakingIndex, leaderBoardData} = useStaking()
    console.log(leaderBoardData)
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
                            <TableCell align="center" sx={{ paddingX: 1, verticalAlign: 'middle' }}><Typography variant="subtitle2">Pool share </Typography></TableCell>
                            <TableCell align="center" sx={{ paddingX: 1, verticalAlign: 'middle' }}><Typography variant="subtitle2">Last Activity</Typography></TableCell>
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