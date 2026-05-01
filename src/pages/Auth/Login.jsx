import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/UI/Button';
import { Input } from '../../components/UI/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/UI/Card';
import { AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 opacity-20 bg-[length:auto_100%] md:bg-cover bg-center bg-no-repeat bg-fixed"
        style={{ backgroundImage: 'url(/bg-apps.webp)' }}
      ></div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2">
            <img src="/silsilah-apps-logo.svg" alt="B-Silsilah Logo" className="h-10 w-10 object-contain" />
            <span className="font-bold text-2xl text-slate-900">B-Silsilah</span>
          </Link>
        </div>
        
        <Card className="border-slate-200/60 shadow-xl shadow-slate-200/40">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-2xl text-center font-bold">Selamat Datang Kembali</CardTitle>
            <CardDescription className="text-center">
              Masuk untuk mengelola silsilah keluarga Anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-md bg-red-50 border border-red-200 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-red-600 font-medium">{error}</p>
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="email">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-slate-50"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700" htmlFor="password">
                    Password
                  </label>
                  {/* Optional Forgot Password link could go here */}
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-slate-50"
                />
              </div>
              <Button type="submit" className="w-full mt-6" disabled={isLoading}>
                {isLoading ? 'Memproses...' : 'Masuk'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center pt-2 pb-6">
            <p className="text-sm text-slate-600">
              Belum punya akun?{' '}
              <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
                Daftar sekarang
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
