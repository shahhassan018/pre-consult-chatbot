"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';

// Import third party library (MUI)
import {
  Box,
  Button,
  Container,
  Typography,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Paper,
  Divider,
  Grid,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Import types and constants
import { PatientContext, PersonalQuestion, QuestionItem, QuestionResponse, Step } from '@/types';
import { INITIAL_PATIENT_CONTEXT, NUM_QUESTIONS, QUESTIONS_POOL } from '@/constants/generalConstants';
import { selectRandomQuestions } from '@/helpers';


const PreConsultChatbot = () => {

  // Initial States
  const [step, setStep] = useState<Step>(Step.CONSENT);
  const [patientContext, setPatientContext] = useState<PatientContext>(INITIAL_PATIENT_CONTEXT);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [localAnswer, setLocalAnswer] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Memoize the 5 random questions
  const selectedQuestions = useMemo(() => selectRandomQuestions(QUESTIONS_POOL, NUM_QUESTIONS), []);

  // Initialize consultation Responses with empty answers for all selected questions
  const [consultationResponses, setConsultationResponses] = useState<QuestionResponse[]>(
    selectedQuestions.map(q => ({ question: q.text, answer: '' }))
  );

  useEffect(() => {
    if (step === Step.MEDICAL_QUESTIONS) {
        // Load existing answer, if any, when index changes
        setLocalAnswer(consultationResponses[currentQuestionIndex]?.answer || '');
        setError(null); // Clear errors when moving to a new question
    }
  }, [currentQuestionIndex, step, consultationResponses]);


  // Consent Handler
  const handleConsent = (agreed: boolean) => {
    setError(null);
    if (agreed) {
      setStep(Step.PERSONAL_INFO);
    } else {
      setStep(Step.DENIED);
    }
  };

  // Personal Info Handler and validations
  const validatePersonalInfo = () => {
    const { name, dob, gender } = patientContext;
    if (!name.trim()) return 'Name is required.';
    if (!gender.trim()) return 'Gender is required. Please select an option.';
    
    // Simple dd/mm/yyyy validation
    const dobRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dobRegex.test(dob)) return 'Date of Birth must be in DD/MM/YYYY format (e.g., 25/12/1990).';

    return null;
  };

  const handlePersonalInfoNext = () => {
    const validationError = validatePersonalInfo();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    // Move to the first medical question (index 0)
    setCurrentQuestionIndex(0); 
    setLocalAnswer(consultationResponses[0]?.answer || ''); // Load first answer
    setStep(Step.MEDICAL_QUESTIONS);
  };

  // Medical Question Handlers (Navigation Logic)
  const currentQuestion = selectedQuestions[currentQuestionIndex];

  // Helper to update the answer array
  const handleAnswerUpdate = (index: number, answer: string) => {
    setConsultationResponses(prevResponses => {
      const newResponses = [...prevResponses];
      if (newResponses[index]) {
        newResponses[index] = { ...newResponses[index], answer: answer };
      }
      return newResponses;
    });
  };

  const handleNext = () => {
    // Validation check
    if (!localAnswer.trim()) {
      setError('Please provide an answer to continue.');
      return;
    }
    setError(null);

    // Save the current answer
    handleAnswerUpdate(currentQuestionIndex, localAnswer);

    // Check if there are more questions
    if (currentQuestionIndex < selectedQuestions.length - 1) {
      // Go to next question
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // All questions answered, proceed to saving
      setStep(Step.SAVING);
    }
  };

  const handleBack = () => {
    // Save the current answer before moving away
    handleAnswerUpdate(currentQuestionIndex, localAnswer);

    // Go back one step or to Personal Info
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else {
      // If on the first question, go back to Personal Info step
      setStep(Step.PERSONAL_INFO);
    }
  };


  // Mock API with Save
  const mockApiSave = useCallback(async () => {
    setLoading(true);

    const finalResponses = consultationResponses.map((data, index) => ({
      ...data,
      answer: index === currentQuestionIndex ? localAnswer.trim() : data.answer.trim(),
    }));

    const payload = {
      patientContext: patientContext,
      userResponses: finalResponses,
    };

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    setLoading(false);
    setStep(Step.COMPLETE);
  }, [patientContext, consultationResponses, localAnswer, currentQuestionIndex]);

  useEffect(() => {
    if (step === Step.SAVING) {
      mockApiSave();
    }
  }, [step, mockApiSave]);


  // Helper Render Functions
  const renderConsentStep = () => (
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
          onClick={() => handleConsent(true)}
          sx={{ py: 1.5, borderRadius: '12px' }}
        >
          Yes, I agree
        </Button>
        <Button
          fullWidth
          variant="outlined"
          color="error"
          size="large"
          onClick={() => handleConsent(false)}
          sx={{ py: 1.5, borderRadius: '12px' }}
        >
          No, thank you
        </Button>
      </Box>
    </Box>
  );

  const renderDeniedStep = () => (
    <Alert severity="error" icon={<CloseIcon fontSize="inherit" />} sx={{ borderRadius: '12px' }}>
      <Typography variant="body1">
        I understand. Please let me know when you're ready to begin.
      </Typography>
      <Button
        variant="text"
        size="small"
        color="error"
        onClick={() => setStep(Step.CONSENT)}
        sx={{ mt: 1 }}
      >
        Restart Consultation
      </Button>
    </Alert>
  );

  const personalQuestions: PersonalQuestion[] = [
    { label: 'What is your name?', key: 'name', type: 'text' },
    { label: 'What is your Date of birth (DD/MM/YYYY)?', key: 'dob', type: 'text', placeholder: 'e.g., 25/12/1990' },
  ];

  const renderPersonalInfoStep = () => {
    return (
      <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
          Personal Information
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please provide the following details:
        </Typography>
        
        {/* Name and DOB Fields */}
        {personalQuestions.map(q => (
          <TextField
            key={q.key}
            label={q.label}
            fullWidth
            variant="outlined"
            value={patientContext[q.key as keyof PatientContext]}
            onChange={(e) => setPatientContext(prev => ({ ...prev, [q.key]: e.target.value }))}
            placeholder={q.placeholder || 'Your answer'} 
          />
        ))}

        {/* Gender Select */}
        <FormControl fullWidth>
          <InputLabel id="gender-select-label">What is your gender?</InputLabel>
          <Select
            labelId="gender-select-label"
            id="gender-select"
            value={patientContext.gender}
            label="What is your gender?"
            onChange={(e) => setPatientContext(prev => ({ ...prev, gender: e.target.value as string }))}
          >
            <MenuItem value="">
              <em>Select your gender</em>
            </MenuItem>
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Prefer not to say">Prefer not to say</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => setStep(Step.CONSENT)}
            sx={{ borderRadius: '12px' }}
          >
            Back
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handlePersonalInfoNext}
            sx={{ borderRadius: '12px' }}
          >
            Confirm and Continue
          </Button>
        </Box>
      </Box>
    );
  };

  const renderMedicalQuestionsStep = () => {
    const isFirstQuestion = currentQuestionIndex === 0;
    const isLastQuestion = currentQuestionIndex === selectedQuestions.length - 1;
    const progress = ((currentQuestionIndex + 1) / selectedQuestions.length) * 100;

    return (
      <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Question {currentQuestionIndex + 1} of {selectedQuestions.length}
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
          onChange={(e) => setLocalAnswer(e.target.value)}
          placeholder="Type your response here..."
        />

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleBack}
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
            onClick={handleNext}
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

  const renderSavingStep = () => (
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

  const renderCompleteStep = () => {
    const finalResponses = consultationResponses; 

    return (
      <Paper elevation={4} sx={{ p: 4, borderRadius: '16px', bgcolor: 'success.light', border: '2px solid', borderColor: 'success.main' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 1 }}>
          <CheckCircleOutlineIcon color="success" sx={{ fontSize: 60 }} />
          <Typography variant="h4" component="h2" color="success.dark" sx={{ fontWeight: 'bold' }}>
            Consultation Complete!
          </Typography>
          <Typography variant="body1" color="success.dark" sx={{ mb: 2 }}>
            Thank information. Your responses have been securely stored and will be reviewed by your doctor.
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Summary Section Start */}
        <Box sx={{ textAlign: 'left', mt: 3, gap: 3 }}>
          <Typography variant="h6" color="success.dark" sx={{ fontWeight: 'semibold', mb: 2 }}>
            Summary of Information Provided
          </Typography>

          {/* Patient Context Summary */}
          <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: 'background.paper', borderRadius: '10px' }}>
            <Typography variant="subtitle1" color="primary.main" sx={{ fontWeight: 'bold', mb: 1 }}>Patient Context</Typography>
            <Grid container spacing={1}>
              {/* FIX: Explicitly setting component="div" to satisfy strict TypeScript type checks for Grid items */}
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
          <Typography variant="subtitle1" color="primary.main" sx={{ fontWeight: 'bold', mb: 1 }}>Medical Responses (5 Questions)</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {finalResponses.map((response, index) => (
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
        {/* Summary Section End */}
      </Paper>
    );
  };

  const renderContent = () => {
    switch (step) {
      case Step.CONSENT:
        return renderConsentStep();
      case Step.PERSONAL_INFO:
        return renderPersonalInfoStep();
      case Step.MEDICAL_QUESTIONS:
        return renderMedicalQuestionsStep();
      case Step.SAVING:
        return renderSavingStep();
      case Step.COMPLETE:
        return renderCompleteStep();
      case Step.DENIED:
        return renderDeniedStep();
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f4f6f8' }}>
      <Paper elevation={8} sx={{ p: 4, borderRadius: '24px', width: '100%', maxWidth: '550px' }}>
        <Typography variant="h4" component="h1" color="primary" align="center" sx={{ fontWeight: 'extrabold', mb: 2 }}>
          🩺 PreConsult Chatbot
        </Typography>
        <Divider sx={{ mb: 4 }} />

        {/* Error Message Display */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }}>
            {error}
          </Alert>
        )}

        {/* Main Content Render */}
        {renderContent()}

        {/* Footer/Context */}
        {step !== Step.CONSENT && step !== Step.DENIED && (
          <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid', borderColor: 'grey.200', fontSize: '0.75rem', color: 'text.disabled' }}>
            <Typography variant="caption" display="block">Name: {patientContext.name || '...'}</Typography>
            <Typography variant="caption" display="block">Progress: {currentQuestionIndex + 1} / {selectedQuestions.length} questions viewed</Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default PreConsultChatbot;