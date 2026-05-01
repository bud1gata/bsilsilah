import React from 'react';
import { X, UserPlus, Edit2, Trash2 } from 'lucide-react';
import { Button } from '../UI/Button';
import { getBaseUrl } from '../../services/api';

export const NodeModal = ({ node, onClose, onAddRelation, onEdit, onDelete, isReadOnly }) => {
  if (!node) return null;
  const { data } = node;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/20 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900">Detail Profil</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col items-center mb-8">
            {data.photoUrl ? (
              <img src={`${getBaseUrl()}${data.photoUrl}`} alt={data.name} className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-white shadow-md" />
            ) : (
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 ${data.gender === 'male' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'}`}>
                <span className="text-3xl font-bold">{data.name.charAt(0)}</span>
              </div>
            )}
            <h3 className="text-2xl font-bold text-slate-900 text-center">{data.name}</h3>
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800 mt-2 capitalize">
              {data.gender === 'male' ? 'Laki-laki' : 'Perempuan'}
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-slate-500 mb-1">Tanggal Lahir</h4>
              <p className="text-slate-900">{data.birthDate ? new Date(data.birthDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}</p>
            </div>
            {data.deathDate && (
              <div>
                <h4 className="text-sm font-medium text-slate-500 mb-1">Tanggal Wafat</h4>
                <p className="text-slate-900">{new Date(data.deathDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            )}
            
            {/* Can add more details here: Bio, Birthplace, etc. */}
          </div>
        </div>

        {!isReadOnly && (
          <div className="p-4 border-t border-slate-100 bg-slate-50 space-y-3">
            <Button className="w-full gap-2" onClick={() => onAddRelation(node)}>
              <UserPlus className="w-4 h-4" />
              Tambah Relasi
            </Button>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 gap-2" onClick={() => onEdit(node)}>
                <Edit2 className="w-4 h-4" />
                Edit
              </Button>
              <Button variant="destructive" className="flex-1 gap-2" onClick={() => onDelete(node.id)}>
                <Trash2 className="w-4 h-4" />
                Hapus
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
