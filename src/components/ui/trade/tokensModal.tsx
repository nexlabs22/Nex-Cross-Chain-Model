'use client'

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { Avatar, IconButton, Typography } from '@mui/material';
import { OutlinedInput } from '@mui/material';
import { IoSearch } from "react-icons/io5"; 
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

// This interface is used for passing data to the virtualized list.
interface TokenListData {
    tokens: ExampleToken[];
    visibleCount: number;
    onSelect: (token: ExampleToken) => void;
}

function renderRow(props: ListChildComponentProps<TokenListData>) {
    const { index, style, data } = props;
    const { tokens, visibleCount, onSelect } = data;

    if (index >= visibleCount) {
        return (
            <ListItem style={style} key={index} component="div" disablePadding>
                <Stack
                    width="100%"
                    height={70}
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                    spacing={1}
                >
                    <Skeleton variant="circular" width={40} height={40} />
                    <Stack direction="row" spacing={1}>
                        <Skeleton variant="rectangular" width={100} height={20} />
                        <Skeleton variant="rectangular" width={50} height={20} />
                    </Stack>
                </Stack>
            </ListItem>
        );
    }

    const token = tokens[index];
    return (
        <ListItem style={style} key={token.id} component="div" disablePadding sx={{ borderRadius: '1rem' }}>
            <ListItemButton
                onClick={() => {
                    // When a token is clicked, call the onSelect callback.
                    onSelect(token);
                }}
            >
                <ListItemAvatar>
                    {token.logo ? (
                        <Avatar
                            alt={token.symbol}
                            src={token.logo}
                            sx={{
                                width: 40,
                                height: 40,
                                backgroundColor: theme.palette.elevations.elevation50.main,
                                border: 'none'
                            }}
                        />
                    ) : (
                        <Skeleton variant="circular" width={40} height={40} />
                    )}
                </ListItemAvatar>
                <ListItemText primary={token.name} secondary={token.symbol} />
            </ListItemButton>
        </ListItem>
    );
}

// Notice the additional onSelect prop here.
export default function TokensModal({
    open,
    onClose,
    onSelect
}: {
    open: boolean;
    onClose: () => void;
    onSelect: (token: ExampleToken) => void;
}) {
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

    const handleInputChange = (event: React.SyntheticEvent, value: string) => {
        if (!value) {
            setFilteredTokens(tokens);
            setVisibleCount(Math.min(50, tokens.length));
        } else {
            const filtered = tokens.filter((token) =>
                token.name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredTokens(filtered);
            setVisibleCount(Math.min(50, filtered.length));
        }
    };

    const isItemLoaded = (index: number) => index < visibleCount;

    const loadMoreItems = (startIndex: number, stopIndex: number) => {
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                setVisibleCount((prev) =>
                    Math.min(filteredTokens.length, prev + (stopIndex - startIndex + 1))
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
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Typography variant="h6">Select a token</Typography>
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
                <Stack
                    width={"100%"}
                    alignItems={"center"}
                    gap={1}
                    paddingTop={1}
                    sx={{
                        '& .tokensInfiniteList': {
                            scrollbarWidth: 'none',
                            '&::-webkit-scrollbar': {
                                display: 'none',
                            },
                        },
                    }}
                >
                    <Autocomplete
                        disablePortal
                        options={filteredTokens}
                        sx={{
                            width: "100%",
                            border: 'none',
                            outline: 'none',
                            '& .MuiOutlinedInput-root': {
                                border: 'none',
                                outline: 'none',
                            },
                        }}
                        getOptionLabel={(option) => option.name}
                        onInputChange={handleInputChange}
                        renderInput={(params) => (
                            <OutlinedInput
                                startAdornment={
                                    <IconButton>
                                        <IoSearch size={20} color={theme.palette.text.secondary} />
                                    </IconButton>
                                }
                                {...params}
                                sx={{
                                    borderBottom: `none`,
                                    outline: 'none',
                                    backgroundColor: theme.palette.elevations.elevation900.main,
                                    borderRadius: '1rem',
                                    padding: '0.5rem',
                                    color: theme.palette.info.main,
                                }}
                            />
                        )}
                    />
                    <InfiniteLoader
                        isItemLoaded={isItemLoaded}
                        itemCount={filteredTokens.length}
                        loadMoreItems={loadMoreItems}
                    >
                        {({ onItemsRendered, ref }) => (
                            <FixedSizeList
                                height={400}
                                width={"100%"}
                                itemCount={filteredTokens.length}
                                itemSize={70}
                                overscanCount={5}
                                // Pass onSelect as part of the itemData
                                itemData={{ tokens: filteredTokens, visibleCount, onSelect }}
                                onItemsRendered={onItemsRendered}
                                ref={ref}
                                className="tokensInfiniteList"
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
