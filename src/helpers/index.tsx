import { QuestionItem } from "@/types";

// Randomly selects 'count' unique questions from the pool.
export const selectRandomQuestions = (pool: QuestionItem[], count: number): QuestionItem[] => {
    if (count >= pool.length) return pool;
  
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };