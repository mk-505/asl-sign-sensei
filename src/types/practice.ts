export interface PracticeResult {
  id: string;
  lessonId: string;
  lessonTitle: string;
  date: string;
  correctSigns: string[];
  incorrectSigns: string[];
  score: number;
}