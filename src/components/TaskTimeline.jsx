import { Gantt, ViewMode } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function TaskTimeline({ tasks }) {
  const [view, setView] = useState(ViewMode.Month);

  // Filter tasks that have both start and end dates and convert them to the format required by Gantt
  const timedTasks = tasks.filter(t => t.startDate && t.endDate).map(t => {
     let progress = 0;
     if (t.status === 'done') progress = 100;
     else if (t.status === 'in-progress') progress = 50;

     return {
       id: t._id,
       name: t.title,
       start: new Date(t.startDate),
       end: new Date(t.endDate),
       progress: progress,
       type: 'task',
       project: '',
       styles: { 
         backgroundColor: t.status === 'done' ? '#22c55e' : t.status === 'in-progress' ? '#3b82f6' : '#eab308',
         progressColor: 'rgba(255,255,255,0.4)',
         progressSelectedColor: 'rgba(255,255,255,0.6)'
       }
     };
  });

  if (timedTasks.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground border border-dashed border-border rounded-xl bg-card">
        No tasks with both Start and End dates to display on the Timeline.<br/>
        Please edit your tasks to include timeframes.
      </div>
    );
  }

  return (
    <div className="space-y-4 bg-card p-6 rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="flex gap-2 mb-4 justify-between items-center flex-wrap">
        <h3 className="font-semibold text-lg">Project Timeline</h3>
        <div className="flex gap-2">
          <Button variant={view === ViewMode.Day ? "default" : "outline"} size="sm" onClick={() => setView(ViewMode.Day)}>Day</Button>
          <Button variant={view === ViewMode.Week ? "default" : "outline"} size="sm" onClick={() => setView(ViewMode.Week)}>Week</Button>
          <Button variant={view === ViewMode.Month ? "default" : "outline"} size="sm" onClick={() => setView(ViewMode.Month)}>Month</Button>
        </div>
      </div>
      <div className="overflow-x-auto pb-4">
        <div className="min-w-[800px] gantt-container-custom">
          <Gantt 
            tasks={timedTasks}
            viewMode={view}
            listCellWidth=""
            columnWidth={60}
            rowHeight={50}
            barCornerRadius={6}
            barFill={60}
            todayColor="rgba(139, 92, 246, 0.1)"
          />
        </div>
      </div>
    </div>
  );
}
