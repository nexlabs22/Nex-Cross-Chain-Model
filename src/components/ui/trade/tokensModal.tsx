'use client'

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { IconButton, Typography } from '@mui/material';
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
import { useEffect, useState, useMemo } from 'react';
import { CryptoAsset, IndexCryptoAsset } from "@/types/indexTypes"
import { sepoliaTokens } from '@/constants/tokens';
import { useDashboard } from '@/providers/DashboardProvider';
import { useGlobal } from '@/providers/GlobalProvider';
import { useSwitchActiveWalletChain } from 'thirdweb/react';
import { allowedChainNetworks } from '@/utils/mappings';
import { isIndexCryptoAsset } from '@/utils/general';

interface TokenListData {
  tokens: CryptoAsset[] | IndexCryptoAsset[];
  visibleCount: number;
  onSelect: (token: CryptoAsset | IndexCryptoAsset) => void;
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
    <ListItem
      style={style}
      key={token.symbol}
      component="div"
      disablePadding
      sx={{ borderRadius: '1rem' }}
    >
      <ListItemButton
        onClick={(event) => {
          event.stopPropagation();
          onSelect(token);
        }}
        disabled={isIndexCryptoAsset(token) && token.symbol.toLowerCase() !== 'arbei'}
      >
        <ListItemAvatar>
          {token.logoComponent ? (
            <Box
              width={40}
              height={40}
              overflow='hidden'
              display='flex'
              alignItems='center'
              justifyContent='center'
              borderRadius={'50%'}
              sx={{
                aspectRatio: 1
              }}
            >
              {token.logoComponent}
            </Box>
          ) : (
            <Skeleton variant="circular" width={40} height={40} />
          )}
        </ListItemAvatar>
        <ListItemText primary={token.name} secondary={token.symbol} />
      </ListItemButton>
    </ListItem>
  );
}

export default function TokensModal({
  open,
  showNexProducts,
  showTokens,
  onClose,
  onSelect
}: {
  open: boolean;
  showNexProducts: boolean;
  showTokens: boolean;
  onClose: () => void;
  onSelect: (token: CryptoAsset | IndexCryptoAsset) => void;
}) {
  const [tokens, setTokens] = useState<CryptoAsset[] | IndexCryptoAsset[]>([]);
  const [filteredTokens, setFilteredTokens] = useState<CryptoAsset[] | IndexCryptoAsset[]>([]);
  const [visibleCount, setVisibleCount] = useState<number>(0);
  const [inputValue, setInputValue] = useState("");
  const { nexTokens } = useDashboard()
  const { setActiveChainSetting } = useGlobal()
  const switchChain = useSwitchActiveWalletChain();

  useEffect(() => {
    const tokensContent = [
      ...(showNexProducts ? nexTokens : []),
      ...(showTokens ? sepoliaTokens.filter(token => token.symbol !== 'USDT') : [])
    ];
    setTokens(tokensContent);
    setFilteredTokens(tokensContent);
    setVisibleCount(tokensContent.length)
  }, [nexTokens, showNexProducts, showTokens])

  const handleInputChange = (
    event: React.SyntheticEvent,
    value: string,
    reason: string
  ) => {
    if (reason === 'reset') {
      return;
    }
    setInputValue(value);

    if (!value) {
      setFilteredTokens(tokens);
      setVisibleCount(tokens.length);
    } else {
      const filtered = tokens.filter((token) =>
        token.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredTokens(filtered);
      setVisibleCount(filtered.length);
    }
  };

  function networkCheckpoint(token: CryptoAsset | IndexCryptoAsset) {
    const sepoliaNetwork = allowedChainNetworks[0];
    const tokensNotOnMainnet = nexTokens.filter((token) => { return token.symbol.toLowerCase() !== 'arbei' }).map((token) => { return token.symbol })
    if (tokensNotOnMainnet.includes(token.symbol)) {
      console.warn("Arbitrum is only allowed when index=arbei. Reverting to default.");
      switchChain(sepoliaNetwork.chain)
      setActiveChainSetting(sepoliaNetwork)
    }
  }


  const handleAutocompleteChange = (
    event: React.SyntheticEvent,
    value: CryptoAsset | IndexCryptoAsset | null
  ) => {
    if (value) {
      networkCheckpoint(value);
      onSelect(value);
      onClose();
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

  const itemData = useMemo(() => ({
    tokens: filteredTokens,
    visibleCount,
    onSelect: (token: CryptoAsset | IndexCryptoAsset) => {
      networkCheckpoint(token)
      onSelect(token);
      onClose();
    }
  }), [filteredTokens, visibleCount, onSelect, onClose]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          alignItems: "start",
          backgroundColor: theme.palette.elevations.elevation900.main,
          width: { xs: "90vw", lg: "35vw" },
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
            inputValue={inputValue}
            clearOnBlur={false}
            freeSolo={false}
            onInputChange={(event, value, reason) =>
              handleInputChange(event, value, reason)
            }
            onChange={handleAutocompleteChange}
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
                itemKey={(index, data: TokenListData) =>
                  data.tokens[index]?.symbol || index
                }
                itemData={itemData}
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
