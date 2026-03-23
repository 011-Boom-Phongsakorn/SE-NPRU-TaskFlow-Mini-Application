import { useEffect, useState } from 'react';
import { useTaskStore } from '../stores/useTaskStore';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { PlusCircle, Trash2, Edit, AlignLeft, CalendarRange } from 'lucide-react';
import TaskTimeline from '../components/TaskTimeline';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const TaskDashboardAnalytics = ({ tasks }) => {
  if (!tasks || tasks.length === 0) return null;

  const statusData = [
    { name: 'To Do', value: tasks.filter(t => t.status === 'todo').length },
    { name: 'In Progress', value: tasks.filter(t => t.status === 'in-progress').length },
    { name: 'Done', value: tasks.filter(t => t.status === 'done').length }
  ];

  const priorityData = [
    { name: 'Low', count: tasks.filter(t => t.priority === 'low').length },
    { name: 'Medium', count: tasks.filter(t => t.priority === 'medium').length },
    { name: 'High', count: tasks.filter(t => t.priority === 'high').length }
  ];

  const COLORS = ['#eab308', '#3b82f6', '#22c55e'];

  return (
    <div className="grid md:grid-cols-2 gap-6 bg-card border border-border p-6 rounded-xl shadow-sm mb-6">
      <div className="h-64 flex flex-col items-center">
        <h3 className="font-semibold mb-2 text-muted-foreground">Tasks by Status</h3>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value">
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="h-64 flex flex-col items-center">
        <h3 className="font-semibold mb-2 text-muted-foreground">Tasks by Priority</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={priorityData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip cursor={{ fill: 'transparent' }} />
            <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const { tasks, isLoading, error, fetchTasks, createTask, deleteTask } = useTaskStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'todo', priority: 'medium', startDate: '', endDate: '' });
  const [displayMode, setDisplayMode] = useState('board');

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    await createTask({ ...newTask });
    setNewTask({ title: '', description: '', status: 'todo', priority: 'medium', startDate: '', endDate: '' });
    setIsDialogOpen(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'done': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'in-progress': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default: return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'medium': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      default: return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center bg-card p-6 rounded-xl border border-border shadow-sm mt-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Your Tasks</h2>
          <p className="text-muted-foreground text-sm mt-1">Manage and track your progress</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="default" className="shadow-sm"><PlusCircle className="mr-2 h-4 w-4" /> Add Task</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleCreate}>
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogDescription>
                  Enter the details for your new task below.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title <span className="text-destructive">*</span></Label>
                  <Input
                    id="title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    placeholder="Task name"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="desc">Description <span className="text-muted-foreground text-xs font-normal">(optional)</span></Label>
                  <textarea
                    id="desc"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    placeholder="Add more details about this task..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="startDate">Start Time (optional)</Label>
                    <Input 
                      id="startDate" 
                      type="datetime-local" 
                      value={newTask.startDate} 
                      onChange={(e) => setNewTask({ ...newTask, startDate: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="endDate">End Time (optional)</Label>
                    <Input 
                      id="endDate" 
                      type="datetime-local" 
                      value={newTask.endDate} 
                      onChange={(e) => setNewTask({ ...newTask, endDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={newTask.status}
                      onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="priority">Priority</Label>
                    <select
                      id="priority"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isLoading || !newTask.title.trim()}>Save Task</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error && <p className="text-destructive text-sm bg-destructive/10 p-3 rounded-md">{error}</p>}

      {isLoading && tasks.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border rounded-xl bg-card">
          <p className="text-muted-foreground">No tasks yet. Create one above to get started!</p>
        </div>
      ) : (
        <>
          <TaskDashboardAnalytics tasks={tasks} />
          
          <div className="flex justify-end gap-2 mb-4">
            <Button variant={displayMode === 'board' ? 'default' : 'outline'} size="sm" onClick={() => setDisplayMode('board')} className="shadow-sm">
              <AlignLeft className="mr-2 h-4 w-4" /> Board
            </Button>
            <Button variant={displayMode === 'timeline' ? 'default' : 'outline'} size="sm" onClick={() => setDisplayMode('timeline')} className="shadow-sm">
              <CalendarRange className="mr-2 h-4 w-4" /> Timeline
            </Button>
          </div>

          {displayMode === 'board' ? (
            <div className="grid gap-6 md:grid-cols-3 items-start">
          {[
            { id: 'todo', title: 'To Do' },
            { id: 'in-progress', title: 'In Progress' },
            { id: 'done', title: 'Done' }
          ].map(col => (
            <div key={col.id} className="flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <h3 className="font-semibold text-lg">{col.title}</h3>
                <span className="text-xs font-medium bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                  {tasks.filter(t => t.status === col.id).length}
                </span>
              </div>
              <div className="flex flex-col gap-4">
                {tasks.filter(t => t.status === col.id).length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground border border-dashed rounded-xl bg-card/50">
                    No tasks here
                  </div>
                ) : (
                  tasks.filter(t => t.status === col.id).map(task => (
                    <Card key={task._id} className="flex flex-col hover:border-primary/50 transition-colors shadow-sm overflow-hidden group">
                      <Link to={`/task/${task._id}`} className="flex-1 flex flex-col hover:bg-secondary/20 transition-colors">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start gap-2">
                            <CardTitle className="text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">{task.title}</CardTitle>
                          </div>
                          <div className="flex flex-wrap gap-2 text-xs mt-2 font-medium">
                            <span className={`px-2 py-0.5 rounded-full border ${getStatusColor(task.status)}`}>
                              {task.status.replace('-', ' ').toUpperCase()}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full border ${getPriorityColor(task.priority)}`}>
                              {task.priority.toUpperCase()}
                            </span>
                          </div>
                          {(task.startDate || task.endDate) && (
                            <div className="flex justify-between items-center text-[10px] text-muted-foreground mt-3 border-t border-border/50 pt-2">
                              {task.startDate && <span>Start: {format(new Date(task.startDate), 'MMM d, yyyy HH:mm')}</span>}
                              {task.endDate && <span>End: {format(new Date(task.endDate), 'MMM d, yyyy HH:mm')}</span>}
                            </div>
                          )}
                        </CardHeader>
                        <CardContent className="flex-1">
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {task.description || "No description provided."}
                          </p>
                        </CardContent>
                      </Link>
                      <CardFooter className="flex justify-between border-t border-border pt-4 mt-auto bg-card">
                        <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-primary pl-2">
                          <Link to={`/task/${task._id}`}>
                            <Edit className="h-4 w-4 mr-1" /> Edit
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteTask(task._id)} className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 pr-2">
                          <Trash2 className="h-4 w-4 mr-1" /> Delete
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
        ) : (
          <TaskTimeline tasks={tasks} />
        )}
      </>
    )}
  </div>
);
}
