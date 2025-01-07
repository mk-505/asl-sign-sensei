import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import type { PracticeResult } from "@/types/practice";

const PracticeHistory = ({ results }: { results: PracticeResult[] }) => {
  if (results.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No practice history yet. Start practicing to see your results here!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Practice History</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Lesson</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((result) => (
            <TableRow key={result.id}>
              <TableCell>{formatDistanceToNow(new Date(result.date))} ago</TableCell>
              <TableCell>{result.lessonTitle}</TableCell>
              <TableCell>{Math.round(result.score)}%</TableCell>
              <TableCell>
                {result.correctSigns.length} correct, {result.incorrectSigns.length} incorrect
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PracticeHistory;