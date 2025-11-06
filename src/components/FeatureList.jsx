import React from 'react';
import { Image as ImageIcon, Waveform, Trash2 } from 'lucide-react';

export default function FeatureList({ features, attachments, onRemove }) {
  return (
    <div className="bg-white/80 backdrop-blur rounded-xl shadow border border-gray-200 p-3 max-h-64 overflow-auto">
      <h3 className="text-sm font-semibold text-gray-800 mb-2">Features</h3>
      {features.length === 0 ? (
        <p className="text-sm text-gray-500">No features yet. Use the tools to add points or polylines, then attach media.</p>
      ) : (
        <ul className="space-y-2">
          {features.map((f, idx) => {
            const att = attachments[idx] || [];
            const geomType = f.feature.geometry.type;
            return (
              <li key={idx} className="flex items-start justify-between gap-3 p-2 rounded-lg border border-gray-200 bg-white">
                <div>
                  <div className="text-sm font-medium text-gray-800">{geomType}</div>
                  <div className="text-xs text-gray-500">{geomType === 'Point' ? JSON.stringify(f.feature.geometry.coordinates) : `${f.feature.geometry.coordinates.length} vertices`}</div>
                  {att.length > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      {att.some((a) => a.type === 'photo') && <ImageIcon className="w-4 h-4 text-blue-600" />}
                      {att.some((a) => a.type === 'audio') && <Waveform className="w-4 h-4 text-green-600" />}
                    </div>
                  )}
                </div>
                <button onClick={() => onRemove(idx)} className="text-red-600 hover:text-red-700 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
