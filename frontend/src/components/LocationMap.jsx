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
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
        Click or drag marker to set location
      </label>
      <div 
        ref={mapRef} 
        className="w-full h-64 rounded-lg border border-gray-300 overflow-hidden"
        style={{ minHeight: '256px' }}
      />
      <p className="text-xs text-gray-500">
        {/* Add a check here just in case, for maximum safety */}
        Current: {typeof latitude === 'number' ? latitude.toFixed(4) : 'N/A'}°, 
        {typeof longitude === 'number' ? longitude.toFixed(4) : 'N/A'}°
      </p>
    </div>
  );
};

export default LocationMap;