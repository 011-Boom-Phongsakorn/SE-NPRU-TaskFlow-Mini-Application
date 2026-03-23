import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuthStore } from './stores/useAuthStore';
import { useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TaskDetail from './pages/TaskDetail';
import Profile from './pages/Profile';
import Home from './pages/Home';

function App() {
  const { user, checkAuth, isLoading } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center dark bg-background text-foreground">Loading TaskFlow...</div>;
  }

  return (
    <Router>
      <div className="dark min-h-screen bg-background text-foreground flex flex-col">
        <header className="p-4 px-6 border-b border-border flex justify-between items-center bg-card shadow-sm shrink-0">
          <Link to="/" className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity">TaskFlow Mini</Link>
          
          <div className="flex gap-6 items-center">
            {user ? (
              <>
                <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">Dashboard</Link>
                <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  {user.profilePic ? (
                    <img src={user.profilePic} alt="Profile" className="w-8 h-8 rounded-full object-cover border border-primary/20" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm font-medium hidden sm:inline-block">{user.username}</span>
                </Link>
                <button onClick={() => useAuthStore.getState().logout()} className="text-sm text-destructive hover:underline font-medium focus:outline-none">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium hover:text-primary transition-colors">Login</Link>
                <Link to="/register" className="text-sm font-medium hover:text-primary transition-colors">Register</Link>
              </>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
            <Route path="/task/:id" element={user ? <TaskDetail /> : <Navigate to="/login" />} />
            <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
