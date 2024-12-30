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
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);

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

        const isCorrect = await recognizeSign(model, videoElement, "current-sign");
        if (isCorrect) {
          handleCorrectSign();
        }
      }, 500);
    } else {
      handleNextSign();
    }

    return () => {
      clearInterval(timer);
      clearInterval(recognitionInterval);
    };
  }, [timeLeft, videoElement, model]);

  const handleCorrectSign = () => {
    toast({
      title: "Correct!",
      description: "Great job! Moving to next sign...",
    });
    handleNextSign();
  };

  const handleNextSign = () => {
    if (currentSignIndex + 1 >= lesson.totalSigns) {
      onComplete();
    } else {
      setCurrentSignIndex(prev => prev + 1);
      setTimeLeft(15);
      setProgress((currentSignIndex + 1) * 100 / lesson.totalSigns);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Progress value={progress} className="w-full max-w-md" />
        <span className="ml-4 font-mono">{timeLeft}s</span>
      </div>

      <div className="relative aspect-video max-w-2xl mx-auto bg-black rounded-lg overflow-hidden">
        <HandCamera onVideoRef={setVideoElement} />
      </div>
    </div>
  );
};

export default PracticeSession;