import React from 'react';

// Import third party library (MUI)
import {
    Box,
    Typography,
    CircularProgress,
} from '@mui/material';

const SavingStep: React.FC = () => (
    <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 8,
            gap: 2,
            bgcolor: 'warning.light',
            borderRadius: '16px',
            border: '1px solid',
            borderColor: 'warning.main'
        }}
    >
        <CircularProgress color="warning" size={40} />
        <Typography variant="body1" sx={{ fontWeight: 'medium', color: 'warning.dark' }}>
            Processing and securely saving your responses...
        </Typography>
    </Box>
);

export default SavingStep;