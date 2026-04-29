import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, GitFork } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trees, setTrees] = useState([]);
  const [loading, setLoading] = useState(true);

  // In a real app, you might fetch a list of family trees associated with this user
  // For the PRD, we assume there is one primary tree per user, or they can create a root.
  // We'll simulate fetching tree status
  useEffect(() => {
    const checkTreeStatus = async () => {
      try {
        // Mock API call for now. In real backend: api.get('/trees')
        // const response = await api.get('/trees');
        // setTrees(response.data.data);
        
        // Simulating empty state for PRD Phase 2
        setTrees([]); 
      } catch (error) {
        console.error("Error fetching trees", error);
      } finally {
        setLoading(false);
      }
    };

    checkTreeStatus();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-2">Selamat datang, {user?.name || user?.firstName || 'Pengguna'}. Kelola silsilah keluarga Anda di sini.</p>
        </header>

        {trees.length === 0 ? (
          /* Empty State (Fase 2 PRD) */
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center flex flex-col items-center">
            <div className="bg-indigo-50 text-indigo-600 p-4 rounded-full mb-6 ring-8 ring-indigo-50/50">
              <GitFork className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Silsilah Keluarga Belum Dibuat</h2>
            <p className="text-slate-600 max-w-md mb-8">
              Mulai catat sejarah keluarga Anda dengan menambahkan orang pertama (Root) sebagai titik awal silsilah.
            </p>
            <Button size="lg" onClick={() => navigate('/tree/new')} className="gap-2 text-base">
              <Plus className="w-5 h-5" />
              Mulai Buat Silsilah
            </Button>
          </div>
        ) : (
          /* Tree List State */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trees.map((tree) => (
              <div key={tree.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{tree.name}</h3>
                <p className="text-slate-500 mb-6 text-sm">Terakhir diperbarui: {tree.updatedAt}</p>
                <Link to={`/tree/${tree.id}`}>
                  <Button variant="outline" className="w-full">
                    Buka Silsilah
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
