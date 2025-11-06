import React, { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default marker icon paths for Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function MapCanvas({ activeTool, features, setFeatures }) {
  const mapRef = useRef(null);
  const drawState = useRef({ drawing: false, latlngs: [] });

  useEffect(() => {
    if (mapRef.current) return; // already initialized

    const map = L.map('map', {
      center: [0, 0],
      zoom: 2,
      minZoom: 2,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    map.on('click', (e) => {
      if (activeTool === 'point') {
        const marker = L.marker(e.latlng).addTo(map);
        const feat = { type: 'Feature', geometry: { type: 'Point', coordinates: [e.latlng.lng, e.latlng.lat] }, properties: {} };
        setFeatures((prev) => [...prev, { layer: marker, feature: feat }]);
      } else if (activeTool === 'polyline') {
        const state = drawState.current;
        state.drawing = true;
        state.latlngs.push([e.latlng.lat, e.latlng.lng]);

        if (state.polyline) {
          state.polyline.setLatLngs(state.latlngs.map((p) => [p[0], p[1]]));
        } else {
          state.polyline = L.polyline(state.latlngs.map((p) => [p[0], p[1]]), { color: 'blue' }).addTo(map);
        }
      }
    });

    map.on('dblclick', () => {
      const state = drawState.current;
      if (activeTool === 'polyline' && state.drawing && state.latlngs.length > 1) {
        const feat = {
          type: 'Feature',
          geometry: { type: 'LineString', coordinates: state.latlngs.map((p) => [p[1], p[0]]) },
          properties: {},
        };
        setFeatures((prev) => [...prev, { layer: state.polyline, feature: feat }]);
        drawState.current = { drawing: false, latlngs: [], polyline: null };
      }
    });

    mapRef.current = map;
  }, [activeTool, setFeatures]);

  useEffect(() => {
    // Render existing features when features change (noop because layers already added)
    // Could be extended to re-render from GeoJSON
  }, [features]);

  return (
    <div id="map" className="w-full h-full rounded-xl overflow-hidden border border-gray-200" />
  );
}
