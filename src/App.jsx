import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/Layout/PrivateRoute';
import Landing from './pages/Landing';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard';
import TreeView from './pages/Tree/TreeView';
import SharedTreeView from './pages/Tree/SharedTreeView';
import Profile from './pages/Auth/Profile';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/share/:shareToken" element={<SharedTreeView />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tree/:id" element={<TreeView />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
