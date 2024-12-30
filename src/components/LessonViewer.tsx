import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Flashcard, { FlashcardData } from "./Flashcard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// This would typically come from your backend
const LESSON_DATA: Record<string, FlashcardData[]> = {
  alphabet: [
    { word: "A", imageUrl: "/placeholder.svg" },
    { word: "B", imageUrl: "/placeholder.svg" },
    { word: "C", imageUrl: "/placeholder.svg" },
    // ... add more letters
  ],
  numbers: [
    { word: "0", imageUrl: "/placeholder.svg" },
    { word: "1", imageUrl: "/placeholder.svg" },
    { word: "2", imageUrl: "/placeholder.svg" },
    // ... add more numbers
  ],
  greetings: [
    { word: "Hello", imageUrl: "/placeholder.svg" },
    { word: "Goodbye", imageUrl: "/placeholder.svg" },
    { word: "Thank you", imageUrl: "/placeholder.svg" },
    // ... add more greetings
  ],
};

const LessonViewer = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!lessonId || !LESSON_DATA[lessonId]) {
    return <div>Lesson not found</div>;
  }

  const flashcards = LESSON_DATA[lessonId];

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate("/learn")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Lessons
      </Button>

      <div className="flex flex-col items-center gap-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">
            Card {currentIndex + 1} of {flashcards.length}
          </h2>
          <p className="text-muted-foreground">
            Click the card to see the sign
          </p>
        </div>

        <Flashcard
          data={flashcards[currentIndex]}
          onNext={handleNext}
          onPrevious={handlePrevious}
          hasNext={currentIndex < flashcards.length - 1}
          hasPrevious={currentIndex > 0}
        />
      </div>
    </div>
  );
};

export default LessonViewer;