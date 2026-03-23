import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTaskStore } from '../stores/useTaskStore';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save } from 'lucide-react';

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateTask, fetchTasks, tasks } = useTaskStore();
  
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchTaskDetail = async () => {
      try {
        setLoading(true);
        if (tasks.length === 0) {
          await fetchTasks();
        }
      } catch (err) {
        setError('Failed to load task details');
      } finally {
        setLoading(false);
      }
    };
    fetchTaskDetail();
  }, [fetchTasks, tasks.length]);

  useEffect(() => {
    if (!loading && tasks.length > 0) {
      const foundTask = tasks.find(t => t._id === id);
      if (foundTask) {
        setTask(foundTask);
      } else {
        setError("Task not found");
      }
    }
  }, [loading, tasks, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await updateTask(id, {
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      startDate: task.startDate || null,
      endDate: task.endDate || null
    });
    setSaving(false);
    navigate('/dashboard');
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading task details...</div>;
  if (error || !task) return <div className="p-8 text-center text-destructive">{error || "Task not found"}</div>;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Button variant="ghost" className="mb-6 -ml-4 hover:bg-secondary/50" onClick={() => navigate('/dashboard')}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Button>

      <Card className="shadow-lg border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl">Edit Task</CardTitle>
          <CardDescription>Make changes to your task details below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="task-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                value={task.title} 
                onChange={e => setTask({...task, title: e.target.value})} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea 
                id="description" 
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={task.description} 
                onChange={e => setTask({...task, description: e.target.value})} 
                placeholder="Add more details about this task..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select 
                  id="status" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={task.status} 
                  onChange={e => setTask({...task, status: e.target.value})}
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <select 
                  id="priority" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={task.priority} 
                  onChange={e => setTask({...task, priority: e.target.value})}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 border-t border-border pt-6 mt-4">
          <Button variant="outline" onClick={() => navigate('/dashboard')} type="button">Cancel</Button>
          <Button type="submit" form="task-form" disabled={saving} className="bg-primary">
            <Save className="mr-2 h-4 w-4" /> {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
