import React, { useState, useRef } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import api from '../../services/api';

export const AddRelationModal = ({ sourceNode, onClose, onSave }) => {
  const [relationType, setRelationType] = useState('child'); // parent, child, spouse
  const [formData, setFormData] = useState({
    name: '',
    gender: 'male',
    birthDate: '',
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    let photoUrl = '';

    try {
      if (photoFile) {
        const uploadData = new FormData();
        uploadData.append('photo', photoFile);
        const res = await api.post('/upload', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        photoUrl = res.data.data.photoUrl;
      }
      
      await onSave(sourceNode?.id, relationType, { ...formData, photoUrl });
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal mengunggah foto');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-lg font-semibold text-slate-900">
            {sourceNode ? `Tambah Relasi untuk ${sourceNode.data.name}` : 'Buat Silsilah Baru'}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {sourceNode && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Jenis Relasi</label>
              <div className="grid grid-cols-3 gap-2">
                {['parent', 'spouse', 'child'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setRelationType(type)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg border capitalize transition-colors ${
                      relationType === type 
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {type === 'parent' ? 'Orang Tua' : type === 'spouse' ? 'Pasangan' : 'Anak'}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Nama Lengkap</label>
            <Input 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Masukkan nama"
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

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Tanggal Lahir (Opsional)</label>
            <Input 
              type="date"
              value={formData.birthDate}
              onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Foto Profil (Opsional)</label>
            <div className="flex items-center gap-4">
              <div 
                className="w-16 h-16 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center bg-slate-50 overflow-hidden cursor-pointer hover:border-indigo-400 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-slate-400" />
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
                  {photoFile ? 'Ganti Foto' : 'Pilih Foto'}
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
          </div>

          <div className="pt-4 flex gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose} disabled={isUploading}>Batal</Button>
            <Button type="submit" className="flex-1" disabled={isUploading}>
              {isUploading ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
