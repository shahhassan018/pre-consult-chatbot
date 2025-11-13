import React from 'react';

// Import third party library (MUI)
import {
    Box,
    Button,
    Typography,

} from '@mui/material';


interface ConsentStepProps {
    onConsent: (agreed: boolean) => void;
}

const ConsentStep: React.FC<ConsentStepProps> = ({ onConsent }) => (
    <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Typography variant="h6" color="textPrimary" sx={{ fontWeight: 'medium' }}>
            <Typography component="span" color="primary" sx={{ fontWeight: 'bold' }}>PreConsult:</Typography> I would like to ask you some questions before you visit the doctor. Do you agree?
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                onClick={() => onConsent(true)}
                sx={{ py: 1.5, borderRadius: '12px' }}
            >
                Yes, I agree
            </Button>
            <Button
                fullWidth
                variant="outlined"
                color="error"
                size="large"
                onClick={() => onConsent(false)}
                sx={{ py: 1.5, borderRadius: '12px' }}
            >
                No, thank you
            </Button>
        </Box>
    </Box>
);

export default ConsentStep;