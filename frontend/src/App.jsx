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
  <aside className="w-72 flex-shrink-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-slate-300 flex flex-col shadow-2xl border-r border-slate-700/50">
    {/* App Branding */}
    <div className="h-20 flex items-center justify-center border-b border-slate-700/50 px-6 bg-slate-800/50">
      <div className="flex items-center space-x-4">
        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-500 rounded-xl shadow-lg ring-2 ring-amber-400/20">
          <span className="text-white text-2xl font-bold drop-shadow-sm">☀</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Heliotelligence</h1>
          <p className="text-xs text-slate-400 font-medium">Solar Analytics Platform</p>
        </div>
      </div>
    </div>

    {/* Navigation Links */}
    <nav className="flex-1 px-6 py-8 space-y-3">
      <a href="#" className="flex items-center px-4 py-3 text-white bg-gradient-to-r from-blue-600/80 to-blue-500/80 rounded-xl font-semibold shadow-lg ring-1 ring-blue-400/20 backdrop-blur-sm">
        <LayoutDashboard className="w-5 h-5 mr-4" />
        <span>Dashboard</span>
      </a>
      <a href="#" className="flex items-center px-4 py-3 text-slate-400 hover:bg-slate-700/50 hover:text-white rounded-xl transition-all duration-300 hover:shadow-md group">
        <Settings className="w-5 h-5 mr-4 group-hover:rotate-90 transition-transform duration-300" />
        <span>Settings</span>
      </a>
      <a href="#" className="flex items-center px-4 py-3 text-slate-400 hover:bg-slate-700/50 hover:text-white rounded-xl transition-all duration-300 hover:shadow-md group">
        <HelpCircle className="w-5 h-5 mr-4 group-hover:scale-110 transition-transform duration-300" />
        <span>Help</span>
      </a>
    </nav>

    {/* Footer */}
    <div className="p-6 border-t border-slate-700/50 bg-slate-800/30">
      <p className="text-xs text-slate-500 font-medium">© 2025 Heliotelligence</p>
      <p className="text-xs text-slate-600 mt-1">v1.0.0</p>
    </div>
  </aside>
);

/**
 * The header for the main content area.
 */
const Header = () => (
  <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex-shrink-0 shadow-sm">
    <div className="flex items-center justify-between h-18 px-8">
      <div className="flex items-center text-sm text-slate-500">
        <span className="font-medium">Dashboard</span>
        <ChevronsRight className="w-4 h-4 mx-2 text-slate-400" />
        <span className="font-semibold text-slate-800 bg-slate-100 px-3 py-1 rounded-full text-xs">Energy Prediction</span>
      </div>
      <div className="flex items-center space-x-6">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-500 cursor-pointer hover:text-slate-800 transition-all duration-200 hover:scale-110" />
        </div>
        <div className="relative">
          <Bell className="w-5 h-5 text-slate-500 cursor-pointer hover:text-slate-800 transition-all duration-200 hover:scale-110" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        </div>
        <div className="flex items-center space-x-3 bg-slate-50 rounded-full px-3 py-2 hover:bg-slate-100 transition-colors duration-200 cursor-pointer">
          <UserCircle className="w-7 h-7 text-slate-400" />
          <span className="text-sm font-medium text-slate-700">Admin</span>
        </div>
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
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        {/* Main content area with scrolling */}
        <main className="flex-1 overflow-y-auto p-8 bg-gradient-to-b from-transparent to-slate-50/50">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Solar Energy Prediction</h2>
              <p className="text-slate-600 font-medium">Configure your system and analyze energy production forecasts</p>
            </div>
            
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
          </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
