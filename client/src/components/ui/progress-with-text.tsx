import { Progress } from "@/components/ui/progress";

interface ProgressWithTextProps {
  current: number;
  total: number;
  className?: string;
}

export function ProgressWithText({ current, total, className = "" }: ProgressWithTextProps) {
  const percentage = Math.min(100, Math.round((current / total) * 100));
  
  return (
    <div className={className}>
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">Progress</span>
        <span className="text-sm text-gray-600">{current}/{total}</span>
      </div>
      <Progress value={percentage} className="h-2.5" />
    </div>
  );
}
