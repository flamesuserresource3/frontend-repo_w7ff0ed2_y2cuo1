import React from 'react';
import { MapPin, PencilLine, MousePointer, Trash2, Download } from 'lucide-react';

const tools = [
  { key: 'select', label: 'Select', icon: MousePointer },
  { key: 'point', label: 'Point', icon: MapPin },
  { key: 'polyline', label: 'Polyline', icon: PencilLine },
];

export default function Toolbar({ activeTool, setActiveTool, onClear, onExport }) {
  return (
    <div className="flex items-center gap-2 p-2 bg-white/80 backdrop-blur rounded-xl shadow border border-gray-200">
      {tools.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => setActiveTool(key)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition border ${
            activeTool === key
              ? 'bg-blue-600 text-white border-blue-600 shadow'
              : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
          }`}
          aria-pressed={activeTool === key}
        >
          <Icon className="w-4 h-4" />
          {label}
        </button>
      ))}

      <div className="mx-2 w-px self-stretch bg-gray-200" />

      <button
        onClick={onExport}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition border bg-white text-gray-700 hover:bg-gray-50 border-gray-200"
        title="Export GeoJSON"
      >
        <Download className="w-4 h-4" /> Export
      </button>

      <button
        onClick={onClear}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition border text-red-600 bg-white hover:bg-red-50 border-red-200"
        title="Clear all features"
      >
        <Trash2 className="w-4 h-4" /> Clear
      </button>
    </div>
  );
}
