"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';

// Import third party library (MUI)
import {
  Box,
  Container,
  Typography,
  Alert,
  Paper,
  Divider,
} from '@mui/material';

// Import types and constants
import { PatientContext, QuestionResponse, Step } from '@/types';
import { INITIAL_PATIENT_CONTEXT, NUM_QUESTIONS, QUESTIONS_POOL } from '@/constants/generalConstants';
import { selectRandomQuestions } from '@/helpers';
import ConsentStep from './ConsentStep';
import PersonalInfoStep from './PersonalInfoStep';
import MedicalQuestionsStep from './MedicalQuestionsStep';
import CompleteStep from './CompleteStep';
import DeniedStep from './DeniedStep';
import SavingStep from './SavingStep';


const PreConsultChatbot = () => {
  // --- State Initialization ---
  const [step, setStep] = useState<Step>(Step.CONSENT);
  const [patientContext, setPatientContext] = useState<PatientContext>(INITIAL_PATIENT_CONTEXT);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [localAnswer, setLocalAnswer] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Memoize the 5 random questions
  const selectedQuestions = useMemo(() => selectRandomQuestions(QUESTIONS_POOL, NUM_QUESTIONS), []);

  // Initialize consultationResponses with empty answers for all selected questions
  const [consultationResponses, setConsultationResponses] = useState<QuestionResponse[]>(
    selectedQuestions.map(q => ({ question: q.text, answer: '' }))
  );

  const currentQuestion = selectedQuestions[currentQuestionIndex];

  useEffect(() => {
    if (step === Step.MEDICAL_QUESTIONS) {
      // Load existing answer, if any, when index changes
      setLocalAnswer(consultationResponses[currentQuestionIndex]?.answer || '');
      setError(null); // Clear errors when moving to a new question
    }
  }, [currentQuestionIndex, step, consultationResponses]);

  // Handlers

  const handleConsent = useCallback((agreed: boolean) => {
    setError(null);
    if (agreed) {
      setStep(Step.PERSONAL_INFO);
    } else {
      setStep(Step.DENIED);
    }
  }, []);

  const handleContextChange = useCallback((key: keyof PatientContext, value: string) => {
    setPatientContext(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleAnswerUpdate = useCallback((index: number, answer: string) => {
    setConsultationResponses(prevResponses => {
      const newResponses = [...prevResponses];
      if (newResponses[index]) {
        newResponses[index] = { ...newResponses[index], answer: answer };
      }
      return newResponses;
    });
  }, []);

  const validatePersonalInfo = useCallback(() => {
    const { name, dob, gender } = patientContext;
    if (!name.trim()) return 'Name is required.';
    if (!gender.trim()) return 'Gender is required. Please select an option.';

    // Simple dd/mm/yyyy validation
    const dobRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dobRegex.test(dob)) return 'Date of Birth must be in DD/MM/YYYY format (e.g., 25/12/1990).';

    return null;
  }, [patientContext]);

  const handlePersonalInfoNext = useCallback(() => {
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
  }, [validatePersonalInfo, consultationResponses]);

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

    console.log('--- Mock API Payload ---');
    console.log(JSON.stringify(payload, null, 2));

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    setLoading(false);
    setStep(Step.COMPLETE);
  }, [patientContext, consultationResponses, localAnswer, currentQuestionIndex]);


  const handleNext = useCallback(() => {
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
  }, [localAnswer, currentQuestionIndex, selectedQuestions.length, handleAnswerUpdate]);

  const handleBack = useCallback(() => {
    // Save the current answer before moving away
    handleAnswerUpdate(currentQuestionIndex, localAnswer);

    // Go back one step or to Personal Info
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else {
      // If on the first question, go back to Personal Info step
      setStep(Step.PERSONAL_INFO);
    }
  }, [currentQuestionIndex, localAnswer, handleAnswerUpdate]);

  useEffect(() => {
    if (step === Step.SAVING) {
      mockApiSave();
    }
  }, [step, mockApiSave]);

  const renderContent = () => {
    switch (step) {
      case Step.CONSENT:
        return <ConsentStep onConsent={handleConsent} />;
      case Step.PERSONAL_INFO:
        return (
          <PersonalInfoStep
            patientContext={patientContext}
            onContextChange={handleContextChange}
            onBack={() => setStep(Step.CONSENT)}
            onNext={handlePersonalInfoNext}
          />
        );
      case Step.MEDICAL_QUESTIONS:
        return (
          <MedicalQuestionsStep
            currentQuestion={currentQuestion}
            currentIndex={currentQuestionIndex}
            totalQuestions={selectedQuestions.length}
            localAnswer={localAnswer}
            onAnswerChange={setLocalAnswer}
            onBack={handleBack}
            onNext={handleNext}
            loading={loading}
          />
        );
      case Step.SAVING:
        return <SavingStep />;
      case Step.COMPLETE:
        return (
          <CompleteStep
            patientContext={patientContext}
            consultationResponses={consultationResponses.map((data, index) => ({
              ...data,
              answer: index === currentQuestionIndex ? localAnswer.trim() : data.answer.trim(),
            }))}
          />
        );
      case Step.DENIED:
        return <DeniedStep onRestart={() => setStep(Step.CONSENT)} />;
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