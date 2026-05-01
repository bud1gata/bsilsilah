import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Network, ChevronDown, User, Key, LogOut, X } from 'lucide-react';
import api from '../../services/api';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Modals state
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);

  // Profile form
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  // Password form
  const [passForm, setPassForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passLoading, setPassLoading] = useState(false);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const openProfileModal = () => {
    setProfileName(user?.name || user?.firstName || '');
    setProfileEmail(user?.email || '');
    setIsEditProfileOpen(true);
    setIsDropdownOpen(false);
  };

  const openPasswordModal = () => {
    setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setIsChangePasswordOpen(true);
    setIsDropdownOpen(false);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setProfileLoading(true);
      await api.put('/auth/profile', { name: profileName, email: profileEmail });
      alert('Profil berhasil diperbarui! Silakan muat ulang halaman untuk melihat perubahan pada nama.');
      setIsEditProfileOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal memperbarui profil.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) {
      return alert('Password baru dan konfirmasi password tidak cocok.');
    }
    try {
      setPassLoading(true);
      await api.put('/auth/change-password', {
        currentPassword: passForm.currentPassword,
        newPassword: passForm.newPassword
      });
      setIsChangePasswordOpen(false);
      setIsSuccessPopupOpen(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal mengubah password.');
    } finally {
      setPassLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setIsSuccessPopupOpen(false);
    logout(); // Destroy session and force login
  };

  return (
    <>
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex-shrink-0 flex items-center gap-2">
                <Network className="h-8 w-8 text-indigo-600" />
                <span className="font-bold text-xl text-slate-900 tracking-tight">B-Silsilah</span>
              </Link>
            </div>
            <div className="flex items-center">
              {isAuthenticated ? (
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors focus:outline-none"
                  >
                    Hi, {user?.firstName || user?.name || 'User'}
                    <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50">
                      <button 
                        onClick={openProfileModal}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2"
                      >
                        <User className="w-4 h-4" />
                        Edit Profile
                      </button>
                      <button 
                        onClick={openPasswordModal}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2"
                      >
                        <Key className="w-4 h-4" />
                        Ubah Password
                      </button>
                      <div className="border-t border-slate-100 my-1"></div>
                      <button 
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link
                    to="/login"
                    className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-indigo-600 text-white hover:bg-indigo-700 h-9 px-4 py-2"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">Edit Profil</h2>
              <button onClick={() => setIsEditProfileOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateProfile}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
                  <Input 
                    required
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <Input 
                    type="email"
                    required
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setIsEditProfileOpen(false)}>
                  Batal
                </Button>
                <Button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700" disabled={profileLoading}>
                  {profileLoading ? 'Menyimpan...' : 'Simpan Profil'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {isChangePasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">Ubah Password</h2>
              <button onClick={() => setIsChangePasswordOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleChangePassword}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Password Saat Ini</label>
                  <Input 
                    type="password"
                    required
                    value={passForm.currentPassword}
                    onChange={(e) => setPassForm({...passForm, currentPassword: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Password Baru</label>
                  <Input 
                    type="password"
                    required
                    minLength={6}
                    value={passForm.newPassword}
                    onChange={(e) => setPassForm({...passForm, newPassword: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Konfirmasi Password Baru</label>
                  <Input 
                    type="password"
                    required
                    minLength={6}
                    value={passForm.confirmPassword}
                    onChange={(e) => setPassForm({...passForm, confirmPassword: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setIsChangePasswordOpen(false)}>
                  Batal
                </Button>
                <Button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700" disabled={passLoading}>
                  {passLoading ? 'Menyimpan...' : 'Ubah Password'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Popup for Password Change */}
      {isSuccessPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Password Diubah!</h2>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              Password Anda telah berhasil diperbarui. Demi keamanan, sesi Anda saat ini akan diakhiri. Silakan login kembali dengan password baru Anda.
            </p>
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={handleSuccessClose}>
              OK, Login Kembali
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
