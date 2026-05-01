import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Users, Shield, Share2 } from 'lucide-react';
import { Button } from '../components/UI/Button';

const Landing = () => {
  const { isAuthenticated } = useAuth();

  // If already logged in, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-b from-indigo-50/50 to-white">
        <div className="mb-8 p-4 rounded-full bg-white shadow-sm ring-1 ring-slate-200">
          <img src="/silsilah-apps-logo.svg" alt="B-Silsilah Logo" className="w-16 h-16 object-contain" />
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
          Peta Sejarah <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Keluarga Anda</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mb-10 leading-relaxed">
          Catat, petakan, dan lestarikan warisan keluarga Anda dalam satu tempat yang aman. 
          Visualisasikan silsilah antar generasi secara interaktif.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/register">
            <Button size="lg" className="w-full sm:w-auto text-base">
              Mulai Buat Silsilah
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="lg" className="w-full sm:w-auto text-base">
              Masuk ke Akun
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-indigo-50 text-indigo-600 mb-6 shadow-sm ring-1 ring-indigo-100">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Manajemen Interaktif</h3>
              <p className="text-slate-600">
                Tambahkan dan kelola anggota keluarga dengan antarmuka bagan interaktif yang mudah digunakan.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-indigo-50 text-indigo-600 mb-6 shadow-sm ring-1 ring-indigo-100">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Privasi Terjaga</h3>
              <p className="text-slate-600">
                Data silsilah diamankan dengan enkripsi dan hanya Anda yang memiliki kontrol penuh atas aksesnya.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-indigo-50 text-indigo-600 mb-6 shadow-sm ring-1 ring-indigo-100">
                <Share2 className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Berbagi dengan Mudah</h3>
              <p className="text-slate-600">
                Bagikan silsilah ke keluarga lain dengan tautan "Read-Only" yang aman tanpa khawatir data terubah.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
