import { PatientContext, QuestionItem } from "@/types";

export const QUESTIONS_POOL: QuestionItem[] = [
  { id: 1, text: 'Do you have any known allergies to medications, food, or environmental factors?' },
  { id: 2, text: 'Please describe your main symptom and when it started.' },
  { id: 3, text: 'Have you experienced fever or chills in the last 48 hours?' },
  { id: 4, text: 'Are you currently taking any prescription medications, over-the-counter drugs, or supplements?' },
  { id: 5, text: 'Have you recently traveled outside the country or been in contact with anyone who has been sick?' },
  { id: 6, text: 'On a scale of 1 to 10 (1 being minimal, 10 being severe), how would you rate your current pain level?' },
  { id: 7, text: 'Do you have a history of chronic conditions like diabetes, high blood pressure, or heart disease?' },
  { id: 8, text: 'Have you had any recent surgeries or hospitalizations?' },
  { id: 9, text: 'Do you smoke or consume alcohol regularly?' },
  { id: 10, text: 'Are you pregnant or is there any chance you might be?' },
];

export const INITIAL_PATIENT_CONTEXT: PatientContext = {
  name: '',
  dob: '',
  gender: '',
};

export const NUM_QUESTIONS = 5;