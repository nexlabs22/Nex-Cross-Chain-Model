'use client'

import { Box } from "@mui/material"
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

// project imports : 
import IndexTopHolders from "./indexTopHolders";
import IndexTransactionHistory from "./indextransactionHistory";

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

const IndexDetailsTabbedTablesView = () => {
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
                    marginBottom: 2,
                    justifyContent: { xs: 'center', lg: 'start' },
                    '& .MuiTabs-flexContainer': {
                        width: '100%',
                        alignItems: { xs: 'center', lg: 'start' },
                        justifyContent: { xs: 'center', lg: 'start' },
                    }
                }}>
                    <Tab label="Top Holders" {...a11yProps(0)} />
                    <Tab label="Transaction History" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <IndexTopHolders />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <IndexTransactionHistory />
            </CustomTabPanel>
        </>
    )
}

export default IndexDetailsTabbedTablesView
