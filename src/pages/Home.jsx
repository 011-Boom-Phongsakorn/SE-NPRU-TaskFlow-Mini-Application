import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '../stores/useAuthStore';
import { CheckCircle2, LayoutDashboard, Clock, ShieldCheck } from 'lucide-react';

export default function Home() {
  const { user } = useAuthStore();

  return (
    <div className="flex flex-col min-h-[calc(100vh-73px)] items-center justify-center p-6 text-center">
      <div className="max-w-3xl space-y-8">
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight">
          Master Your Time with <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">TaskFlow Mini</span>
        </h1>
        
        <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          The ultimate personal task management tool to organize your life, track your progress, and achieve your daily goals with a beautiful Kanban interface.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          {user ? (
            <Button size="lg" asChild className="text-lg px-8 h-14 rounded-full shadow-lg hover:shadow-primary/25 transition-all">
              <Link to="/dashboard">
                Go to Dashboard <LayoutDashboard className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          ) : (
            <>
              <Button size="lg" asChild className="text-lg px-8 h-14 rounded-full shadow-lg hover:shadow-primary/25 transition-all">
                <Link to="/register">Get Started for Free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8 h-14 rounded-full">
                <Link to="/login">Sign In</Link>
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-8 mt-24 max-w-5xl">
        <div className="flex flex-col items-center p-6 bg-card rounded-2xl border border-border shadow-sm hover:border-primary/50 transition-colors">
          <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center mb-4">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold mb-2">Kanban Board</h3>
          <p className="text-muted-foreground">Easily move tasks between To Do, In Progress, and Done to track everyday progress.</p>
        </div>
        
        <div className="flex flex-col items-center p-6 bg-card rounded-2xl border border-border shadow-sm hover:border-primary/50 transition-colors">
          <div className="w-12 h-12 bg-purple-500/10 text-purple-500 rounded-xl flex items-center justify-center mb-4">
            <Clock className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold mb-2">Time Tracking</h3>
          <p className="text-muted-foreground">Set start and end dates for your tasks to strictly manage deadlines and schedules.</p>
        </div>
        
        <div className="flex flex-col items-center p-6 bg-card rounded-2xl border border-border shadow-sm hover:border-primary/50 transition-colors">
          <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-xl flex items-center justify-center mb-4">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold mb-2">Analytics & Charts</h3>
          <p className="text-muted-foreground">Visualize your productivity levels categorized by priorities and completion status.</p>
        </div>
      </div>
    </div>
  );
}
