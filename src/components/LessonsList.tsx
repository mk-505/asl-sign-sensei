import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export type Lesson = {
  id: string;
  title: string;
  description: string;
  totalSigns: number;
};

const LESSONS: Lesson[] = [
  {
    id: "alphabet",
    title: "Alphabet (A-Z)",
    description: "Learn the basic ASL alphabet signs",
    totalSigns: 26,
  },
  {
    id: "numbers",
    title: "Numbers (0-9)",
    description: "Learn number signs in ASL",
    totalSigns: 10,
  },
  {
    id: "greetings",
    title: "Common Greetings",
    description: "Learn everyday greeting signs",
    totalSigns: 8,
  },
];

const LessonsList = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">ASL Lessons</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {LESSONS.map((lesson) => (
          <Card 
            key={lesson.id}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(`/learn/${lesson.id}`)}
          >
            <CardHeader>
              <CardTitle>{lesson.title}</CardTitle>
              <CardDescription>{lesson.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {lesson.totalSigns} signs to learn
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LessonsList;