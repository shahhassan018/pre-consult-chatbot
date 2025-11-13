import React from 'react';

// Import third party library (MUI)
import {
    Button,
    Typography,
    Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface DeniedStepProps {
    onRestart: () => void;
}

const DeniedStep: React.FC<DeniedStepProps> = ({ onRestart }) => (
    <Alert severity="error" icon={<CloseIcon fontSize="inherit" />} sx={{ borderRadius: '12px' }}>
        <Typography variant="body1">
            I understand. Please let me know when you're ready to begin.
        </Typography>
        <Button
            variant="text"
            size="small"
            color="error"
            onClick={onRestart}
            sx={{ mt: 1 }}
        >
            Restart Consultation
        </Button>
    </Alert>
)

export default DeniedStep;