import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { User, UserRound } from 'lucide-react';
import { cn } from '../UI/Button';

// Custom node for React Flow
export const FamilyNode = ({ data, selected }) => {
  const isMale = data.gender === 'male';

  return (
    <div 
      className={cn(
        "relative rounded-xl border-2 bg-white shadow-sm p-3 min-w-[180px] transition-all cursor-pointer",
        selected ? "border-indigo-500 shadow-md ring-4 ring-indigo-50" : "border-slate-200 hover:border-indigo-300",
        isMale ? "border-t-blue-500" : "border-t-pink-500"
      )}
    >
      {/* Target handle (top) for incoming parent relations */}
      <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-slate-300" />
      
      <div className="flex flex-col items-center">
        <div className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center mb-2",
          isMale ? "bg-blue-50 text-blue-600" : "bg-pink-50 text-pink-600"
        )}>
          {data.photoUrl ? (
            <img src={data.photoUrl} alt={data.name} className="w-12 h-12 rounded-full object-cover" />
          ) : (
            isMale ? <User className="w-6 h-6" /> : <UserRound className="w-6 h-6" />
          )}
        </div>
        
        <h3 className="text-sm font-bold text-slate-900 text-center leading-tight mb-1">
          {data.name}
        </h3>
        
        <p className="text-xs text-slate-500 text-center">
          {data.birthDate ? new Date(data.birthDate).getFullYear() : 'Unknown'} 
          {data.deathDate && ` - ${new Date(data.deathDate).getFullYear()}`}
        </p>

        {data.isRoot && (
          <span className="absolute -top-3 -right-3 bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
            Root
          </span>
        )}
      </div>

      {/* Source handle (bottom) for outgoing child relations */}
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 !bg-slate-300" id="bottom" />
      
      {/* Handles for spouses (horizontal) */}
      <Handle type="source" position={Position.Right} className="w-2 h-2 !bg-transparent !border-none" id="right" />
      <Handle type="target" position={Position.Left} className="w-2 h-2 !bg-transparent !border-none" id="left" />
    </div>
  );
};
