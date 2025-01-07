import { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import HandCamera from './HandCamera';
import { recognizeSign } from '@/utils/handSignRecognition';
import type { HandPose } from '@tensorflow-models/handpose';
import type { Lesson } from './LessonsList';

interface PracticeSessionProps {
  lesson: Lesson;
  model: HandPose;
  onComplete: () => void;
}

const PracticeSession = ({ lesson, model, onComplete }: PracticeSessionProps) => {
  const { toast } = useToast();
  const [currentSignIndex, setCurrentSignIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [progress, setProgress] = useState(0);
  const [completedSigns, setCompletedSigns] = useState<number[]>([]);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);

  // Get current sign based on lesson type
  const getCurrentSign = () => {
    switch (lesson.id) {
      case 'alphabet':
        return String.fromCharCode(65 + currentSignIndex); // A-Z
      case 'numbers':
        return currentSignIndex.toString(); // 0-9
      case 'greetings':
        const greetings = ['Hello', 'Hi', 'Good Morning', 'Good Night', 'Thank You', 'Please', 'Sorry', 'Goodbye'];
        return greetings[currentSignIndex];
      default:
        return '';
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let recognitionInterval: NodeJS.Timeout;

    if (timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);

      // Run recognition every 500ms
      recognitionInterval = setInterval(async () => {
        if (!videoElement || !model) return;

        const isCorrect = await recognizeSign(model, videoElement, getCurrentSign());
        if (isCorrect && !completedSigns.includes(currentSignIndex)) {
          handleCorrectSign();
        }
      }, 500);
    } else {
      // Timer ran out - move to next sign without increasing progress
      toast({
        title: "Time's up!",
        description: "Moving to next sign. Keep practicing!",
      });
      setCurrentSignIndex(prev => (prev + 1) % lesson.totalSigns);
      setTimeLeft(15);
    }

    return () => {
      clearInterval(timer);
      clearInterval(recognitionInterval);
    };
  }, [timeLeft, videoElement, model, currentSignIndex, completedSigns]);

  const handleCorrectSign = () => {
    const newCompletedSigns = [...completedSigns, currentSignIndex];
    setCompletedSigns(newCompletedSigns);
    const newProgress = (newCompletedSigns.length * 100) / lesson.totalSigns;
    setProgress(newProgress);
    
    toast({
      title: "Correct!",
      description: "Great job! Moving to next sign...",
    });
    
    if (newCompletedSigns.length === lesson.totalSigns) {
      onComplete();
    } else {
      setCurrentSignIndex(prev => (prev + 1) % lesson.totalSigns);
      setTimeLeft(15);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex-1 mr-4">
          <Progress value={progress} className="w-full" />
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-sm">{Math.round(progress)}%</span>
          <span className="font-mono text-sm">{timeLeft}s</span>
        </div>
      </div>

      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold mb-2">Current Sign:</h2>
        <p className="text-4xl font-mono">{getCurrentSign()}</p>
      </div>

      <div className="relative aspect-video max-w-2xl mx-auto bg-black rounded-lg overflow-hidden">
        <HandCamera onVideoRef={setVideoElement} />
      </div>
    </div>
  );
};

export default PracticeSession;