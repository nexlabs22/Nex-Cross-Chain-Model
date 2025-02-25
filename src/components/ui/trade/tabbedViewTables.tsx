'use client'

import { Box, IconButton, Stack } from "@mui/material"
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

// project imports : 
import TransactionHistory from "@/components/ui/generic/transactionHistory"
// import ActiveOrders from "@/components/ui/generic/activeOrders"

import { useState } from "react";
import { IoReload } from "react-icons/io5";
import { useHistory } from "@/providers/HistoryProvider";
import theme from "@/theme/theme";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box>{children}</Box>}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const TabbedTablesView = () => {
    const [value, setValue] = useState(0);
    const { reloadData } = useHistory();

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Stack
                    direction={"row"}
                    alignItems={"center"}
                    justifyContent={"start"}
                    gap={1}
                >
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" sx={{
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: { xs: 'center', lg: 'start' },
                        '& .MuiTabs-flexContainer': {
                            width: '100%',
                            alignItems: { xs: 'center', lg: 'start' },
                            justifyContent: { xs: 'center', lg: 'start' },
                        }
                    }}>
                        <Tab label="Transaction History" {...a11yProps(0)} />
                        {/* <Tab label="Active orders" {...a11yProps(1)} /> */}
                    </Tabs>
                    <IconButton
                        size="small"
                        color="primary"
                        onClick={reloadData}
                        sx={{
                            borderRadius: "50%",
                            border: `1px solid ${theme.palette.elevations.elevation700.main}`,
                            padding: 1,
                        }}
                    >
                        <IoReload />
                    </IconButton>
                </Stack>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <TransactionHistory />
            </CustomTabPanel>
            {/* <CustomTabPanel value={value} index={1}>
                <ActiveOrders />
            </CustomTabPanel> */}
        </>
    )
}

export default TabbedTablesView
