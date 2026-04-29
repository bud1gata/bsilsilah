import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/Layout/PrivateRoute';
import Landing from './pages/Landing';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard';
import TreeView from './pages/Tree/TreeView';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tree/:id" element={<TreeView />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
