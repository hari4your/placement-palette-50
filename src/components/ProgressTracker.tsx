import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressItem {
  label: string;
  current: number;
  target: number;
  color: string;
}

interface ProgressTrackerProps {
  items: ProgressItem[];
}

export function ProgressTracker({ items }: ProgressTrackerProps) {
  const totalCurrent = items.reduce((sum, item) => sum + Math.min(item.current, item.target), 0);
  const totalTarget = items.reduce((sum, item) => sum + item.target, 0);
  const overallProgress = totalTarget > 0 ? Math.round((totalCurrent / totalTarget) * 100) : 0;

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-card space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <Target className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Preparation Progress</h3>
            <p className="text-sm text-muted-foreground">Track your placement readiness</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">{overallProgress}%</p>
          <p className="text-xs text-muted-foreground">Overall</p>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => {
          const progress = item.target > 0 ? Math.min((item.current / item.target) * 100, 100) : 0;
          const isComplete = item.current >= item.target;

          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  {isComplete ? (
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  ) : (
                    <Circle className="w-4 h-4 text-muted-foreground" />
                  )}
                  <span className={cn(
                    "font-medium",
                    isComplete ? "text-primary" : "text-foreground"
                  )}>
                    {item.label}
                  </span>
                </div>
                <span className="text-muted-foreground">
                  {item.current}/{item.target}
                </span>
              </div>
              <Progress 
                value={progress} 
                className="h-2"
              />
            </div>
          );
        })}
      </div>

      {overallProgress === 100 && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-primary/10 text-primary text-sm font-medium">
          <CheckCircle2 className="w-4 h-4" />
          You're fully prepared! Keep practicing to stay sharp.
        </div>
      )}
    </div>
  );
}
