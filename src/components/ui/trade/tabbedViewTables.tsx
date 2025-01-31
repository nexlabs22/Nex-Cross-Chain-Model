'use client'

import { Box } from "@mui/material"
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

// project imports : 
import TransactionHistory from "@/components/ui/generic/transactionHistory"
import ActiveOrders from "@/components/ui/generic/activeOrders"

import { useState } from "react";

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

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" sx={{
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: {xs: 'center', lg: 'start'},
                    '& .MuiTabs-flexContainer':{
                        width: '100%',
                        alignItems: {xs: 'center', lg: 'start'},
                        justifyContent: {xs: 'center', lg: 'start'},
                    }
                }}>
                    <Tab label="Transaction History" {...a11yProps(0)} />
                    <Tab label="Active orders" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <TransactionHistory />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <ActiveOrders />
            </CustomTabPanel>
        </>
    )
}

export default TabbedTablesView
