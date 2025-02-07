'use client'

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { Avatar, IconButton } from '@mui/material';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { ListItemAvatar } from '@mui/material';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import Skeleton from '@mui/material/Skeleton';
import theme from '@/theme/theme';
import { IoMdClose } from "react-icons/io";
import { useEffect, useState } from 'react';

import { fetchCoinMarketCapTokens } from '@/utils/fetchCMCTokens';

interface ExampleToken {
    id: string;
    name: string;
    symbol: string;
    logo: string;
}

interface TokenData {
    tokens: ExampleToken[];
    visibleCount: number;
}

function renderRow(props: ListChildComponentProps<TokenData>) {
    const { index, style, data } = props;
    const { tokens, visibleCount } = data;

    if (index >= visibleCount) {
        return (
            <ListItem style={style} key={index} component="div" disablePadding>
                <Stack width="100%" height={70} direction="row" alignItems="center" justifyContent="center">
                    <Skeleton variant="circular" height={70} />
                    <Stack width="100%" height={70} direction="row" alignItems="center" justifyContent="center">
                        <Skeleton variant="rectangular" height={70} />
                        <Skeleton variant="rectangular" height={70} />
                    </Stack>
                </Stack>
            </ListItem>
        );
    }

    const token = tokens[index];
    return (
        <ListItem style={style} key={token.id} component="div" disablePadding>
            <ListItemButton>
                <ListItemAvatar>
                    {token.logo ? <Avatar alt={token.symbol} src={token.logo} sx={{ width: 40, height: 40, backgroundColor: theme.palette.elevations.elevation50.main }} /> : <Skeleton variant="circular" height={40} />}
                </ListItemAvatar>
                <ListItemText primary={token.name} secondary={token.symbol} />
            </ListItemButton>
        </ListItem>
    );
}

export default function TokensModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    const [tokens, setTokens] = useState<ExampleToken[]>([]);
    const [filteredTokens, setFilteredTokens] = useState<ExampleToken[]>([]);
    const [visibleCount, setVisibleCount] = useState<number>(0);

    useEffect(() => {
        fetchCoinMarketCapTokens()
            .then((tokens) => {
                setTokens(tokens);
                setFilteredTokens(tokens);
                setVisibleCount(Math.min(50, tokens.length));
            })
            .catch((err) => console.error(err));
    }, []);

    const isItemLoaded = (index: number) => index < visibleCount;

    const loadMoreItems = (startIndex: number, stopIndex: number) => {
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                setVisibleCount((prev) =>
                    Math.min(tokens.length, prev + (stopIndex - startIndex + 1))
                );
                resolve();
            }, 500);
        });
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "start",
                    alignItems: "start",
                    backgroundColor: theme.palette.elevations.elevation900.main,
                    width: "35vw",
                    height: "80vh",
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    padding: 2,
                    borderRadius: '1rem',
                    overflow: "hidden",
                }}
            >
                <Stack width="100%" direction="row" justifyContent="end">
                    <IconButton onClick={onClose}>
                        <IoMdClose size={24} color={theme.palette.info.main} />
                    </IconButton>
                </Stack>
                <Stack width={"100%"} alignItems={"center"} gap={1} paddingTop={1}>
                    <Autocomplete
                        disablePortal
                        options={tokens}
                        sx={{ width: "100%", border: 'none', outline: 'none' }}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => <TextField {...params} sx={{ 
                            borderBottom: `none`,
                            outline: 'none',
                            backgroundColor: theme.palette.elevations.elevation900.main,
                            borderRadius: '1rem',
                            padding: '0.5rem',
                            color: theme.palette.text.primary
                         }} />}
                    />
                    <InfiniteLoader
                        isItemLoaded={isItemLoaded}
                        itemCount={tokens.length}
                        loadMoreItems={loadMoreItems}
                    >
                        {({ onItemsRendered, ref }) => (
                            <FixedSizeList
                                height={400}
                                width={"100%"}
                                itemCount={tokens.length}
                                itemSize={70}
                                overscanCount={5}
                                itemData={{ tokens: filteredTokens, visibleCount }}
                                onItemsRendered={onItemsRendered}
                                ref={ref}
                            >
                                {renderRow}
                            </FixedSizeList>
                        )}
                    </InfiniteLoader>
                </Stack>
            </Box>
        </Modal>
    );
}
