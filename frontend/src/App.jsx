import React, { useState } from 'react';
import axios from 'axios';
// Corrected import paths to be relative from the current file
import SystemForm from './components/SystemForm';
import LocationMap from './components/LocationMap';
import ResultsDashboard from './components/ResultsDashboard';
import { LayoutDashboard, Settings, HelpCircle, Bell, UserCircle, Search, ChevronsRight } from 'lucide-react';
// Corrected import path
import './App.css';

/**
 * The fixed sidebar for navigation. This has a dark theme for contrast.
 */
const Sidebar = () => (
  <aside className="w-64 flex-shrink-0 bg-gray-900 text-gray-300 flex flex-col">
    {/* App Branding */}
    <div className="h-16 flex items-center justify-center border-b border-gray-700 px-4">
      <div className="flex items-center space-x-3">
        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg shadow-md">
          <span className="text-white text-xl font-bold">☀</span>
        </div>
        <h1 className="text-xl font-bold text-white">Heliotelligence</h1>
      </div>
    </div>

    {/* Navigation Links */}
    <nav className="flex-1 px-4 py-6 space-y-2">
      <a href="#" className="flex items-center px-4 py-2.5 text-white bg-gray-700/50 rounded-lg font-semibold">
        <LayoutDashboard className="w-5 h-5 mr-3" />
        Dashboard
      </a>
      <a href="#" className="flex items-center px-4 py-2.5 text-gray-400 hover:bg-gray-700/50 hover:text-white rounded-lg transition-colors duration-200">
        <Settings className="w-5 h-5 mr-3" />
        Settings
      </a>
      <a href="#" className="flex items-center px-4 py-2.5 text-gray-400 hover:bg-gray-700/50 hover:text-white rounded-lg transition-colors duration-200">
        <HelpCircle className="w-5 h-5 mr-3" />
        Help
      </a>
    </nav>

    {/* Footer */}
    <div className="p-4 border-t border-gray-700">
      <p className="text-xs text-gray-500">© 2025 Heliotelligence</p>
    </div>
  </aside>
);

/**
 * The header for the main content area.
 */
const Header = () => (
  <header className="bg-white border-b border-gray-200 flex-shrink-0">
    <div className="flex items-center justify-between h-16 px-6">
      <div className="flex items-center text-sm text-gray-500">
        <span>Dashboard</span>
        <ChevronsRight className="w-4 h-4 mx-1" />
        <span className="font-semibold text-gray-800">Energy Prediction</span>
      </div>
      <div className="flex items-center space-x-5">
        <Search className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-800 transition-colors duration-200" />
        <Bell className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-800 transition-colors duration-200" />
        <UserCircle className="w-8 h-8 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors duration-200" />
      </div>
    </div>
  </header>
);

/**
 * The main App component that orchestrates the layout and state.
 */
function App() {
  // All of your existing state and logic remains UNCHANGED
  const [systemConfig, setSystemConfig] = useState({
    location: { latitude: 51.5074, longitude: -0.1278, altitude: 11 },
    array: { tilt: 35, azimuth: 180, stringing: { modules_per_string: 20, strings_per_inverter: 10 }},
    module_params: { power: 400, temp_coefficient: -0.35 },
    inverter_params: { power: 50000, efficiency: 96.5 },
    loss_params: { soiling: 2.0, shading: 1.0, snow: 0.5, mismatch: 2.0, wiring: 2.0, connections: 0.5, lid: 1.5, nameplate: 1.0, age: 0.0, availability: 3.0 }
  });

  const [predictionResults, setPredictionResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLocationChange = (newLocation) => {
    setSystemConfig(prev => ({ ...prev, location: { ...prev.location, ...newLocation } }));
  };

  const handleConfigChange = (section, updates) => {
    setSystemConfig(prev => ({ ...prev, [section]: { ...prev[section], ...updates } }));
  };

  const generatePrediction = async () => {
    setIsLoading(true);
    setError(null);
    setPredictionResults(null);
    try {
      const response = await axios.post('/api/v1/predict', systemConfig);
      setPredictionResults(response.data);
    } catch (err) {
      console.error('Prediction error:', err);
      setError(err.response?.data?.error || 'Failed to generate prediction');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        {/* Main content area with scrolling */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            
            {/* Left Column: Configuration */}
            <div className="space-y-8">
              <LocationMap
                location={systemConfig.location}
                onLocationChange={handleLocationChange}
              />
              <SystemForm
                config={systemConfig}
                onConfigChange={handleConfigChange}
                onGenerate={generatePrediction}
                isLoading={isLoading}
              />
            </div>

            {/* Right Column: Results */}
            <div className="space-y-8">
              <ResultsDashboard
                results={predictionResults}
                isLoading={isLoading}
                error={error}
              />
            </div>
            
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
