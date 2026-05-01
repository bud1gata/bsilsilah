import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import api, { getBaseUrl } from '../../services/api';

export const EditNodeModal = ({ node, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: 'male',
    birthDate: '',
    deathDate: '',
  });

  // Track relation changes to send together on save
  const [relationChanges, setRelationChanges] = useState([]);

  // Photo
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (node && node.data) {
      // Split name back to first and last for editing
      const nameParts = (node.data.name || '').trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      setFormData({
        firstName,
        lastName,
        gender: node.data.gender || 'male',
        birthDate: node.data.birthDate ? new Date(node.data.birthDate).toISOString().split('T')[0] : '',
        deathDate: node.data.deathDate ? new Date(node.data.deathDate).toISOString().split('T')[0] : '',
        photoUrl: node.data.photoUrl || '',
      });
      
      setRelationChanges([]); // reset
      setPhotoPreview(node.data.photoUrl ? `${getBaseUrl()}${node.data.photoUrl}` : null);
      setPhotoFile(null);
    }
  }, [node]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    let finalPhotoUrl = formData.photoUrl;

    try {
      if (photoFile) {
        const uploadData = new FormData();
        uploadData.append('photo', photoFile);
        const res = await api.post('/upload', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        finalPhotoUrl = res.data.data.photoUrl;
      }
      
      await onSave(node.id, { ...formData, photoUrl: finalPhotoUrl }, relationChanges);
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menyimpan profil');
    } finally {
      setIsUploading(false);
    }
  };

  const handleQueueRelationChange = (targetId, newType) => {
    // If user changes their mind again before saving, just keep the latest change for this targetId
    setRelationChanges(prev => {
      const existing = prev.filter(c => c.targetId !== targetId);
      return [...existing, { targetId, newType }];
    });
  };

  if (!node) return null;

  const parents = node.data.parents || [];
  const spouses = node.data.spouses || [];
  const children = node.data.children || [];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm overflow-y-auto py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 my-auto">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-lg font-semibold text-slate-900">Edit Profil {node.data.name}</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex items-center gap-4 mb-2">
            <div 
              className="w-20 h-20 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center bg-slate-50 overflow-hidden cursor-pointer hover:border-indigo-400 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {photoPreview ? (
                <img src={photoPreview.startsWith('blob:') ? photoPreview : `${getBaseUrl()}${formData.photoUrl}`} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.target.src = photoPreview} />
              ) : (
                <ImageIcon className="w-8 h-8 text-slate-400" />
              )}
            </div>
            <div className="flex-1">
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4" />
                Ganti Foto Profil
              </Button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/jpeg,image/png,image/webp,image/avif" 
                onChange={handlePhotoChange}
              />
              {photoFile && <p className="text-xs text-slate-500 mt-1 truncate">{photoFile.name}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Nama Depan</label>
            <Input 
              required
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              placeholder="Masukkan nama depan"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Nama Belakang</label>
            <Input 
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              placeholder="Masukkan nama belakang"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Jenis Kelamin</label>
            <select
              className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={formData.gender}
              onChange={(e) => setFormData({...formData, gender: e.target.value})}
            >
              <option value="male">Laki-laki</option>
              <option value="female">Perempuan</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Tanggal Lahir</label>
              <Input 
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Tanggal Wafat</label>
              <Input 
                type="date"
                value={formData.deathDate}
                onChange={(e) => setFormData({...formData, deathDate: e.target.value})}
              />
            </div>
          </div>

          <hr className="my-4 border-slate-100" />

          {/* Relation Management Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Ubah Relasi Saat Ini</h3>
            <p className="text-xs text-slate-500">Pilih status relasi baru, lalu klik "Simpan Profil" di bawah untuk menerapkan perubahan.</p>
            
            {parents.length === 0 && spouses.length === 0 && children.length === 0 && (
              <p className="text-sm text-slate-400 italic">Belum ada relasi.</p>
            )}

            <div className="space-y-2 mt-2">
              {parents.map(p => (
                <div key={p._id} className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-200">
                  <div className="text-sm">
                    <span className="font-semibold">{p.firstName}</span> <span className="text-slate-500 text-xs">(Orang Tua)</span>
                  </div>
                  <select 
                    className="text-xs border-slate-300 rounded p-1"
                    onChange={(e) => {
                      if(e.target.value !== '') handleQueueRelationChange(p._id, e.target.value);
                    }}
                    defaultValue=""
                  >
                    <option value="" disabled>Ganti Menjadi...</option>
                    <option value="spouse">Pasangan</option>
                    <option value="child">Anak</option>
                  </select>
                </div>
              ))}

              {spouses.map(s => (
                <div key={s._id} className="flex items-center justify-between bg-indigo-50/50 p-2 rounded-lg border border-indigo-100">
                  <div className="text-sm">
                    <span className="font-semibold">{s.firstName}</span> <span className="text-indigo-500 text-xs">(Pasangan)</span>
                  </div>
                  <select 
                    className="text-xs border-slate-300 rounded p-1"
                    onChange={(e) => {
                      if(e.target.value !== '') handleQueueRelationChange(s._id, e.target.value);
                    }}
                    defaultValue=""
                  >
                    <option value="" disabled>Ganti Menjadi...</option>
                    <option value="parent">Orang Tua</option>
                    <option value="child">Anak</option>
                  </select>
                </div>
              ))}

              {children.map(c => (
                <div key={c._id} className="flex items-center justify-between bg-emerald-50/50 p-2 rounded-lg border border-emerald-100">
                  <div className="text-sm">
                    <span className="font-semibold">{c.firstName}</span> <span className="text-emerald-500 text-xs">(Anak)</span>
                  </div>
                  <select 
                    className="text-xs border-slate-300 rounded p-1"
                    onChange={(e) => {
                      if(e.target.value !== '') handleQueueRelationChange(c._id, e.target.value);
                    }}
                    defaultValue=""
                  >
                    <option value="" disabled>Ganti Menjadi...</option>
                    <option value="parent">Orang Tua</option>
                    <option value="spouse">Pasangan</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex gap-3 mt-4 border-t border-slate-100">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose} disabled={isUploading}>Tutup</Button>
            <Button type="submit" className="flex-1" disabled={isUploading}>
              {isUploading ? 'Menyimpan...' : 'Simpan Profil'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
