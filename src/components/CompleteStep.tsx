import React from 'react';

// Import third party library (MUI)
import {
    Box,
    Typography,
    Paper,
    Divider,
    Grid,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

// Import types and constants
import { PatientContext, QuestionResponse } from '@/types';


interface CompleteStepProps {
    patientContext: PatientContext;
    consultationResponses: QuestionResponse[];
}

const CompleteStep: React.FC<CompleteStepProps> = ({ patientContext, consultationResponses }) => (
    <Paper elevation={4} sx={{ p: 4, borderRadius: '16px', bgcolor: 'success.light', border: '2px solid', borderColor: 'success.main' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 1 }}>
            <CheckCircleOutlineIcon color="success" sx={{ fontSize: 60 }} />
            <Typography variant="h4" component="h2" color="success.dark" sx={{ fontWeight: 'bold' }}>
                Consultation Complete!
            </Typography>
            <Typography variant="body1" color="success.dark" sx={{ mb: 2 }}>
                Thank you for your information. Your responses have been securely stored and will be reviewed by your doctor.
            </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ textAlign: 'left', mt: 3, gap: 3 }}>
            <Typography variant="h6" color="success.dark" sx={{ fontWeight: 'semibold', mb: 2 }}>
                Summary of Information Provided
            </Typography>

            {/* Patient Context Summary */}
            <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: 'background.paper', borderRadius: '10px' }}>
                <Typography variant="subtitle1" color="primary.main" sx={{ fontWeight: 'bold', mb: 1 }}>Patient Context</Typography>
                <Grid container spacing={1}>
                    {/* Explicitly setting component="div" to satisfy strict TypeScript type checks for Grid items */}
                    <Grid component="div">
                        <Typography variant="body2" color="text.secondary"><strong>Name:</strong> {patientContext.name}</Typography>
                    </Grid>
                    <Grid component="div">
                        <Typography variant="body2" color="text.secondary"><strong>DOB:</strong> {patientContext.dob}</Typography>
                    </Grid>
                    <Grid component="div">
                        <Typography variant="body2" color="text.secondary"><strong>Gender:</strong> {patientContext.gender}</Typography>
                    </Grid>
                </Grid>
            </Paper>

            {/* Consultation Responses */}
            <Typography variant="subtitle1" color="primary.main" sx={{ fontWeight: 'bold', mb: 1 }}>Medical Responses ({consultationResponses.length} Questions)</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {consultationResponses.map((response, index) => (
                    <Paper key={index} variant="outlined" sx={{ p: 2, bgcolor: 'background.default', borderRadius: '10px' }}>
                        <Typography variant="body2" color="text.primary" sx={{ fontWeight: 'medium' }}>
                            <Typography component="span" color="primary" sx={{ fontWeight: 'bold' }}>Q{index + 1}:</Typography> {response.question}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, ml: 2, pl: 1, borderLeft: '2px solid', borderColor: 'grey.300' }}>
                            <Typography component="span" sx={{ fontWeight: 'bold' }}>A:</Typography> {response.answer || "No response provided"}
                        </Typography>
                    </Paper>
                ))}
            </Box>
        </Box>
    </Paper>
);


export default CompleteStep;