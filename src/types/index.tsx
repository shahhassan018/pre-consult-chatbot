export type PatientContext = {
    name: string;
    dob: string; // dd/mm/yyyy
    gender: string;
  };
  
 export type QuestionResponse = {
    question: string;
    answer: string;
  };
  
 export type QuestionItem = {
    id: number;
    text: string;
  };
  
 export type PersonalQuestion = {
    label: string;
    key: keyof PatientContext;
    type: 'text' | 'select'; 
    placeholder?: string;
  };
  
export enum Step {
    CONSENT = 'consent',
    PERSONAL_INFO = 'personal_info',
    MEDICAL_QUESTIONS = 'medical_questions',
    SAVING = 'saving',
    COMPLETE = 'complete',
    DENIED = 'denied',
  }
  