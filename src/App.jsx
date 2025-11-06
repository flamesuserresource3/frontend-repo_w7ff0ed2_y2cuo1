import React, { useMemo, useState } from 'react';
import Toolbar from './components/Toolbar';
import MapCanvas from './components/MapCanvas';
import CapturePanel from './components/CapturePanel';
import FeatureList from './components/FeatureList';

function download(filename, text) {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

export default function App() {
  const [activeTool, setActiveTool] = useState('select');
  const [features, setFeatures] = useState([]); // [{layer, feature}]
  const [attachments, setAttachments] = useState({}); // index -> [files]

  const geojson = useMemo(() => ({ type: 'FeatureCollection', features: features.map((f, i) => ({
    ...f.feature,
    properties: { ...f.feature.properties, attachments: (attachments[i] || []).map((a) => ({ type: a.type })) },
  })) }), [features, attachments]);

  const handleAttach = (media) => {
    if (features.length === 0) {
      alert('Add a feature first, then attach media.');
      return;
    }
    const lastIdx = features.length - 1;
    setAttachments((prev) => ({ ...prev, [lastIdx]: [...(prev[lastIdx] || []), media] }));
  };

  const handleClear = () => {
    features.forEach((f) => f.layer.remove());
    setFeatures([]);
    setAttachments({});
  };

  const handleRemove = (idx) => {
    const f = features[idx];
    if (f) f.layer.remove();
    setFeatures((prev) => prev.filter((_, i) => i !== idx));
    setAttachments((prev) => Object.fromEntries(Object.entries(prev).filter(([k]) => Number(k) !== idx)));
  };

  const handleExport = () => {
    download('features.geojson', JSON.stringify(geojson, null, 2));
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-sky-50 to-indigo-50 text-gray-900">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/70 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold">Spatial Mapper</h1>
          <div className="flex items-center gap-3">
            <Toolbar activeTool={activeTool} setActiveTool={setActiveTool} onClear={handleClear} onExport={handleExport} />
            <CapturePanel onAttach={handleAttach} />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <section className="lg:col-span-2 h-[70vh]">
          <MapCanvas activeTool={activeTool} features={features} setFeatures={setFeatures} />
        </section>
        <aside>
          <FeatureList features={features} attachments={attachments} onRemove={handleRemove} />
          <div className="mt-4 p-3 bg-white/80 backdrop-blur rounded-xl shadow border border-gray-200 text-sm">
            <div className="font-semibold mb-2">How it works</div>
            <ol className="list-decimal ml-5 space-y-1 text-gray-600">
              <li>Choose a tool: Point or Polyline.</li>
              <li>Click on the map to add vertices. Double click to finish a line.</li>
              <li>Capture a photo or record audio to attach to the latest feature.</li>
              <li>Export everything as GeoJSON for syncing.</li>
            </ol>
          </div>
        </aside>
      </main>

      <footer className="py-6 text-center text-xs text-gray-500">
        Built for mobile-friendly spatial tagging. Enable mic/camera permissions.
      </footer>
    </div>
  );
}
