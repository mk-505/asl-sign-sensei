import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as tf from '@tensorflow/tfjs';
import * as handpose from '@tensorflow-models/handpose';
import { Progress } from "@/components/ui/progress";
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

const Practice = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedLesson, setSelectedLesson] = useState<string>("");
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [isGameActive, setIsGameActive] = useState(false);
  const [currentSignIndex, setCurrentSignIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [progress, setProgress] = useState(0);
  const [model, setModel] = useState<handpose.HandPose | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize TensorFlow model
  useEffect(() => {
    const loadModel = async () => {
      try {
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

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Handle camera setup
  const setupCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      
      console.log("Camera setup successful");
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        variant: "destructive",
        title: "Camera Error",
        description: "Unable to access your camera. Please check permissions.",
      });
    }
  };

  // Start practice session
  const startPractice = async () => {
    if (!selectedLesson) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a lesson first.",
      });
      return;
    }

    await setupCamera();
    setIsGameActive(true);
    setTimeLeft(15);
    setCurrentSignIndex(0);
    setProgress(0);
  };

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isGameActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Move to next sign when time runs out
      handleNextSign();
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isGameActive, timeLeft]);

  // Handle prediction
  const handlePrediction = async () => {
    if (!model || !videoRef.current || !isGameActive) return;

    try {
      const predictions = await model.estimateHands(videoRef.current);
      console.log("Hand predictions:", predictions);
      
      // TODO: Implement actual sign recognition logic here
      // This is where you would compare the predictions with the expected sign
      
    } catch (error) {
      console.error("Error during prediction:", error);
    }
  };

  // Run predictions
  useEffect(() => {
    let predictionInterval: NodeJS.Timeout;
    
    if (isGameActive && model) {
      predictionInterval = setInterval(handlePrediction, 100);
    }

    return () => {
      if (predictionInterval) clearInterval(predictionInterval);
    };
  }, [isGameActive, model]);

  const handleNextSign = () => {
    const selectedLessonData = LESSONS.find(lesson => lesson.id === selectedLesson);
    if (!selectedLessonData) return;

    if (currentSignIndex + 1 >= selectedLessonData.totalSigns) {
      // Practice session complete
      setIsGameActive(false);
      toast({
        title: "Practice Complete!",
        description: `You completed the ${selectedLessonData.title} practice session!`,
      });
    } else {
      setCurrentSignIndex(prev => prev + 1);
      setTimeLeft(15);
      setProgress((currentSignIndex + 1) * 100 / selectedLessonData.totalSigns);
    }
  };

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
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Progress value={progress} className="w-full max-w-md" />
            <span className="ml-4 font-mono">{timeLeft}s</span>
          </div>

          <div className="relative aspect-video max-w-2xl mx-auto bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Practice;