import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';

export const AddRelationModal = ({ sourceNode, onClose, onSave }) => {
  const [relationType, setRelationType] = useState('child'); // parent, child, spouse
  const [formData, setFormData] = useState({
    name: '',
    gender: 'male',
    birthDate: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(sourceNode?.id, relationType, formData);
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

          <div className="pt-4 flex gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Batal</Button>
            <Button type="submit" className="flex-1">Simpan</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
