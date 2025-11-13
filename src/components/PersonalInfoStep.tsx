import React from 'react';

// Import third party library (MUI)
import {
  Box,
  Button,
  Typography,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';

// Import types and constants
import { PatientContext } from '@/types';
import { personalQuestions } from '@/constants/generalConstants';

interface PersonalInfoStepProps {
    patientContext: PatientContext;
    onContextChange: (key: keyof PatientContext, value: string) => void;
    onBack: () => void;
    onNext: () => void;
  }

  const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({ patientContext, onContextChange, onBack, onNext }) => {
    return (
      <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
          Personal Information
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please provide the following details:
        </Typography>
        
        {/* Name and DOB Fields */}
        {personalQuestions?.map(q => (
          <TextField
            key={q.key}
            label={q.label}
            fullWidth
            variant="outlined"
            value={patientContext[q.key]}
            onChange={(e) => onContextChange(q.key, e.target.value)}
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
            onChange={(e) => onContextChange('gender', e.target.value as string)}
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
            onClick={onBack}
            sx={{ borderRadius: '12px' }}
          >
            Back
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={onNext}
            sx={{ borderRadius: '12px' }}
          >
            Confirm and Continue
          </Button>
        </Box>
      </Box>
    );
  };

  export default PersonalInfoStep;