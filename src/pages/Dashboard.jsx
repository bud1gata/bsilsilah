import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, GitFork, X } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Input } from '../components/UI/Input';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trees, setTrees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTreeName, setNewTreeName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTrees = async () => {
    try {
      setLoading(true);
      const response = await api.get('/trees');
      setTrees(response.data.data);
    } catch (error) {
      console.error("Error fetching trees", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrees();
  }, []);

  const handleCreateTree = async (e) => {
    e.preventDefault();
    if (!newTreeName.trim()) return;

    try {
      setIsSubmitting(true);
      const response = await api.post('/trees', { name: newTreeName });
      setIsCreateModalOpen(false);
      setNewTreeName('');
      // Navigate to the new tree to add the root node
      navigate(`/tree/${response.data.data._id}`);
    } catch (error) {
      console.error("Error creating tree", error);
      alert('Gagal membuat silsilah baru.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTree = async (e, treeId) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('PERINGATAN: Menghapus silsilah akan menghapus seluruh anggota keluarga di dalamnya. Anda yakin?')) {
      try {
        await api.delete(`/trees/${treeId}`);
        fetchTrees();
      } catch (error) {
        alert('Gagal menghapus silsilah.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-50 py-8 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-600 mt-2">Selamat datang, {user?.name || user?.firstName || 'Pengguna'}. Kelola silsilah keluarga Anda di sini.</p>
          </div>
          {trees.length > 0 && (
            <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Silsilah Baru
            </Button>
          )}
        </header>

        {trees.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center flex flex-col items-center">
            <div className="bg-indigo-50 text-indigo-600 p-4 rounded-full mb-6 ring-8 ring-indigo-50/50">
              <GitFork className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Belum Ada Silsilah</h2>
            <p className="text-slate-600 max-w-md mb-8">
              Mulai catat sejarah keluarga Anda dengan membuat silsilah baru.
            </p>
            <Button size="lg" onClick={() => setIsCreateModalOpen(true)} className="gap-2 text-base">
              <Plus className="w-5 h-5" />
              Buat Silsilah Pertama
            </Button>
          </div>
        ) : (
          /* Tree List State */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trees.map((tree) => (
              <div key={tree._id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow relative group">
                <button 
                  onClick={(e) => handleDeleteTree(e, tree._id)}
                  className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Hapus Silsilah"
                >
                  <X className="w-5 h-5" />
                </button>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{tree.name}</h3>
                <p className="text-slate-500 mb-6 text-sm">
                  Dibuat pada: {new Date(tree.createdAt).toLocaleDateString()}
                </p>
                <Link to={`/tree/${tree._id}`}>
                  <Button variant="outline" className="w-full">
                    Buka Silsilah
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Tree Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">Buat Silsilah Baru</h2>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateTree}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Nama Silsilah</label>
                <Input 
                  required
                  placeholder="Misal: Keluarga Ayah, Silsilah Sukamto..."
                  value={newTreeName}
                  onChange={(e) => setNewTreeName(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setIsCreateModalOpen(false)}>
                  Batal
                </Button>
                <Button type="submit" className="flex-1" disabled={isSubmitting || !newTreeName.trim()}>
                  {isSubmitting ? 'Menyimpan...' : 'Buat Silsilah'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
