'use client'

import { client } from '@/utils/thirdWebClient';
import { Box } from '@mui/material';
import Modal from '@mui/material/Modal';
import { PayEmbed } from 'thirdweb/react';

export default function FiatPaymentModal({ open, onClose }: { open: boolean, onClose: () => void }) {

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          alignItems: "start",
          position: 'absolute',
          transform: 'translate(-50%, -50%)',
          top: '50%',
          left: '50%',
          borderRadius: '1rem',
          overflow: "hidden",
        }}
      >
        <PayEmbed
          client={client}
          payOptions={{
            buyWithFiat: {
              testMode: true
            },
          }}
        />
      </Box>
    </Modal>
  );
}
