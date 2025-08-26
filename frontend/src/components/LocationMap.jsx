import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// CORRECTED: The component now accepts a 'location' object prop
const LocationMap = ({ location, onLocationChange }) => {
  // CORRECTED: We get latitude and longitude from the location object
  const { latitude, longitude } = location;

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView([latitude, longitude], 10);
    mapInstanceRef.current = map;

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add marker
    const marker = L.marker([latitude, longitude], {
      draggable: true
    }).addTo(map);
    markerRef.current = marker;

    // Handle marker drag
    marker.on('dragend', function(e) {
      const position = e.target.getLatLng();
      // CORRECTED: Pass an object to the callback function
      onLocationChange({ latitude: position.lat, longitude: position.lng });
    });

    // Handle map click
    map.on('click', function(e) {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      // CORRECTED: Pass an object to the callback function
      onLocationChange({ latitude: lat, longitude: lng });
    });

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []); // This effect should only run once on mount

  // Update marker position when props change
  useEffect(() => {
    // Add checks to ensure map and marker instances exist before using them
    if (markerRef.current && mapInstanceRef.current) {
      const newLatLng = [latitude, longitude];
      markerRef.current.setLatLng(newLatLng);
      mapInstanceRef.current.setView(newLatLng, mapInstanceRef.current.getZoom());
    }
  }, [latitude, longitude]);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden backdrop-blur-sm">
      <div className="p-6 border-b border-slate-100">
        <h3 className="text-lg font-semibold text-slate-900 mb-1">System Location</h3>
        <p className="text-sm text-slate-600">Click or drag the marker to set your installation location</p>
      </div>
      <div 
        ref={mapRef} 
        className="w-full h-80"
        style={{ minHeight: '320px' }}
      />
      <div className="p-4 bg-slate-50/50 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">Coordinates:</span>
          <span className="font-mono text-slate-700 bg-white px-2 py-1 rounded border">
            {typeof latitude === 'number' ? latitude.toFixed(4) : 'N/A'}°, 
            {typeof longitude === 'number' ? longitude.toFixed(4) : 'N/A'}°
          </span>
        </div>
      </div>
    </div>
  );
};

export default LocationMap;