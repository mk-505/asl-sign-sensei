import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type FlashcardData = {
  word: string;
  imageUrl: string;
};

interface FlashcardProps {
  data: FlashcardData;
  onNext: () => void;
  onPrevious: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
}

const Flashcard = ({ data, onNext, onPrevious, hasNext, hasPrevious }: FlashcardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="flex flex-col items-center gap-6">
      <Card
        className={`w-[300px] h-[400px] cursor-pointer transition-all duration-300 transform perspective-1000 ${
          isFlipped ? "rotate-y-180" : ""
        }`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <CardContent className="h-full flex items-center justify-center p-6">
          {!isFlipped ? (
            <h2 className="text-4xl font-bold">{data.word}</h2>
          ) : (
            <div className="rotate-y-180">
              <img
                src={data.imageUrl}
                alt={`ASL sign for ${data.word}`}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={!hasPrevious}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <Button
          onClick={onNext}
          disabled={!hasNext}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default Flashcard;