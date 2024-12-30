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

const Practice = () => {
  const { toast } = useToast();
  const [selectedLesson, setSelectedLesson] = useState<string>("");
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [isGameActive, setIsGameActive] = useState(false);
  const [model, setModel] = useState<handpose.HandPose | null>(null);

  // Initialize TensorFlow model
  useEffect(() => {
    const loadModel = async () => {
      try {
        // Set the backend and wait for it to initialize
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

  const handleComplete = () => {
    setIsGameActive(false);
    const lessonTitle = LESSONS.find(l => l.id === selectedLesson)?.title;
    toast({
      title: "Practice Complete!",
      description: `You completed the ${lessonTitle} practice session!`,
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