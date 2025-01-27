import { useState, useEffect } from 'react';
import * as handpose from '@tensorflow-models/handpose';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { LESSONS } from '@/components/LessonsList';
import PracticeSession from '@/components/PracticeSession';
import PracticeHistory from '@/components/PracticeHistory';
import type { PracticeResult } from '@/types/practice';

const Practice = () => {
  const { toast } = useToast();
  const [selectedLesson, setSelectedLesson] = useState<string>("");
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [isGameActive, setIsGameActive] = useState(false);
  const [model, setModel] = useState<handpose.HandPose | null>(null);
  const [practiceHistory, setPracticeHistory] = useState<PracticeResult[]>([]);

  useEffect(() => {
    // Load practice history from localStorage
    const savedHistory = localStorage.getItem('practiceHistory');
    if (savedHistory) {
      setPracticeHistory(JSON.parse(savedHistory));
    }

    const loadModel = async () => {
      try {
        await tf.setBackend('webgl');
        console.log('TensorFlow backend initialized:', tf.getBackend());
        
        const loadedModel = await handpose.load();
        setModel(loadedModel);
        setIsModelLoading(false);
        console.log("Handpose model loaded successfully");
      } catch (error) {
        console.error("Error loading handpose model:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load hand recognition model. Please try again.",
        });
      }
    };

    loadModel();
  }, []);

  const handleComplete = (result: PracticeResult) => {
    setIsGameActive(false);
    
    // Update practice history
    const newHistory = [result, ...practiceHistory];
    setPracticeHistory(newHistory);
    localStorage.setItem('practiceHistory', JSON.stringify(newHistory));

    toast({
      title: "Practice Complete!",
      description: `You completed the ${result.lessonTitle} practice session with ${Math.round(result.score)}% accuracy!`,
    });
  };

  const startPractice = () => {
    if (!selectedLesson) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a lesson first.",
      });
      return;
    }

    setIsGameActive(true);
  };

  const selectedLessonData = LESSONS.find(lesson => lesson.id === selectedLesson);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-4xl font-bold mb-8">Practice ASL Signs</h1>
      
      {!isGameActive ? (
        <div className="space-y-6">
          <Select onValueChange={setSelectedLesson} value={selectedLesson}>
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue placeholder="Select a lesson" />
            </SelectTrigger>
            <SelectContent>
              {LESSONS.map((lesson) => (
                <SelectItem key={lesson.id} value={lesson.id}>
                  {lesson.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button 
            onClick={startPractice}
            disabled={isModelLoading || !selectedLesson}
          >
            {isModelLoading ? "Loading Model..." : "Start Practice"}
          </Button>

          <PracticeHistory results={practiceHistory} />
        </div>
      ) : (
        model && selectedLessonData && (
          <PracticeSession
            lesson={selectedLessonData}
            model={model}
            onComplete={handleComplete}
          />
        )
      )}
    </div>
  );
};

export default Practice;