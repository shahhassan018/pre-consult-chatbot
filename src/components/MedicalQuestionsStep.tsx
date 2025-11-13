import React from 'react';

// Import third party library (MUI)
import {
    Box,
    Button,
    Typography,
    TextField,
    Paper,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Import types and constants
import { QuestionItem } from '@/types';


interface MedicalQuestionsStepProps {
    currentQuestion: QuestionItem;
    currentIndex: number;
    totalQuestions: number;
    localAnswer: string;
    onAnswerChange: (answer: string) => void;
    onBack: () => void;
    onNext: () => void;
    loading: boolean;
}

const MedicalQuestionsStep: React.FC<MedicalQuestionsStepProps> = ({
    currentQuestion, currentIndex, totalQuestions, localAnswer, onAnswerChange, onBack, onNext, loading
}) => {
    const isFirstQuestion = currentIndex === 0;
    const isLastQuestion = currentIndex === totalQuestions - 1;
    const progress = ((currentIndex + 1) / totalQuestions) * 100;

    return (
        <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Question {currentIndex + 1} of {totalQuestions}
            </Typography>

            {/* Progress Bar */}
            <Box sx={{ height: '8px', bgcolor: 'grey.300', borderRadius: '4px', overflow: 'hidden' }}>
                <Box
                    sx={{
                        height: '100%',
                        bgcolor: 'primary.main',
                        width: `${progress}%`,
                        transition: 'width 0.5s ease-in-out',
                    }}
                />
            </Box>

            {/* Question Prompt */}
            <Paper elevation={3} sx={{ p: 3, borderLeft: '4px solid', borderColor: 'primary.main', borderRadius: '8px' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                    {currentQuestion.text}
                </Typography>
            </Paper>

            {/* Answer Input */}
            <TextField
                multiline
                rows={4}
                fullWidth
                label="Your Response"
                variant="outlined"
                value={localAnswer}
                onChange={(e) => onAnswerChange(e.target.value)}
                placeholder="Type your response here..."
            />

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                    fullWidth
                    variant="outlined"
                    onClick={onBack}
                    disabled={loading}
                    startIcon={<ArrowBackIcon />}
                    sx={{ borderRadius: '12px' }}
                >
                    {isFirstQuestion ? 'Back to Personal Info' : 'Back'}
                </Button>
                <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    onClick={onNext}
                    disabled={loading}
                    endIcon={isLastQuestion ? undefined : <ArrowForwardIcon />}
                    sx={{ borderRadius: '12px' }}
                >
                    {isLastQuestion ? 'Finish Consultation' : 'Next Question'}
                </Button>
            </Box>
        </Box>
    );
};

export default MedicalQuestionsStep;