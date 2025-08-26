import React from 'react';
import { Settings, Zap, Loader2, MapPin, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const SystemForm = ({ config, onConfigChange, onGenerate, isLoading }) => {

  const handleInputChange = (section, field, value) => {
    onConfigChange(section, { ...config[section], [field]: parseFloat(value) || 0 });
  };

  const handleNestedInputChange = (section, subsection, field, value) => {
    const newSubsection = { ...config[section][subsection], [field]: parseFloat(value) || 0 };
    onConfigChange(section, { ...config[section], [subsection]: newSubsection });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate();
  };

  if (!config) {
    return <div>Loading configuration...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Location Section - RESTORED */}
      <Card className="shadow-lg border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-3 text-slate-900">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <span>Location Parameters</span>
          </CardTitle>
          <CardDescription>Specify the geographic location of your installation.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="latitude" className="text-slate-700 font-medium">Latitude (°)</Label>
              <Input 
                id="latitude" 
                type="number" 
                step="0.0001" 
                value={config.location.latitude} 
                onChange={(e) => handleInputChange('location', 'latitude', e.target.value)}
                className="mt-1 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <Label htmlFor="longitude" className="text-slate-700 font-medium">Longitude (°)</Label>
              <Input 
                id="longitude" 
                type="number" 
                step="0.0001" 
                value={config.location.longitude} 
                onChange={(e) => handleInputChange('location', 'longitude', e.target.value)}
                className="mt-1 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="altitude" className="text-slate-700 font-medium">Altitude (m)</Label>
            <Input 
              id="altitude" 
              type="number" 
              value={config.location.altitude} 
              onChange={(e) => handleInputChange('location', 'altitude', e.target.value)}
              className="mt-1 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
            />
          </div>
        </CardContent>
      </Card>

      {/* Array Configuration */}
      <Card className="shadow-lg border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-3 text-slate-900">
            <div className="p-2 bg-green-100 rounded-lg">
              <Settings className="w-5 h-5 text-green-600" />
            </div>
            <span>Array Configuration</span>
          </CardTitle>
          <CardDescription>Configure your solar panel array geometry.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tilt" className="text-slate-700 font-medium">Tilt Angle (°)</Label>
              <Input 
                id="tilt" 
                type="number" 
                min="0" 
                max="90" 
                value={config.array.tilt} 
                onChange={(e) => handleInputChange('array', 'tilt', e.target.value)}
                className="mt-1 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <Label htmlFor="azimuth" className="text-slate-700 font-medium">Azimuth (°)</Label>
              <Input 
                id="azimuth" 
                type="number" 
                min="0" 
                max="360" 
                value={config.array.azimuth} 
                onChange={(e) => handleInputChange('array', 'azimuth', e.target.value)}
                className="mt-1 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="modules_per_string" className="text-slate-700 font-medium">Modules per String</Label>
              <Input 
                id="modules_per_string" 
                type="number" 
                min="1" 
                value={config.array.stringing.modules_per_string} 
                onChange={(e) => handleNestedInputChange('array', 'stringing', 'modules_per_string', e.target.value)}
                className="mt-1 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <Label htmlFor="strings_per_inverter" className="text-slate-700 font-medium">Strings per Inverter</Label>
              <Input 
                id="strings_per_inverter" 
                type="number" 
                min="1" 
                value={config.array.stringing.strings_per_inverter} 
                onChange={(e) => handleNestedInputChange('array', 'stringing', 'strings_per_inverter', e.target.value)}
                className="mt-1 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Equipment Specifications */}
      <Card className="shadow-lg border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-3 text-slate-900">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Zap className="w-5 h-5 text-yellow-600" />
            </div>
            <span>Equipment Specifications</span>
          </CardTitle>
          <CardDescription>Specify your module and inverter parameters.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="module_power" className="text-slate-700 font-medium">Module Power (W)</Label>
              <Input 
                id="module_power" 
                type="number" 
                min="1" 
                value={config.module_params.power} 
                onChange={(e) => handleInputChange('module_params', 'power', e.target.value)}
                className="mt-1 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <Label htmlFor="temp_coefficient" className="text-slate-700 font-medium">Temp. Coefficient (%/°C)</Label>
              <Input 
                id="temp_coefficient" 
                type="number" 
                step="0.01" 
                value={config.module_params.temp_coefficient} 
                onChange={(e) => handleInputChange('module_params', 'temp_coefficient', e.target.value)}
                className="mt-1 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="inverter_power" className="text-slate-700 font-medium">Inverter Power (W)</Label>
              <Input 
                id="inverter_power" 
                type="number" 
                min="1" 
                value={config.inverter_params.power} 
                onChange={(e) => handleInputChange('inverter_params', 'power', e.target.value)}
                className="mt-1 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <Label htmlFor="inverter_efficiency" className="text-slate-700 font-medium">Inverter Efficiency (%)</Label>
              <Input 
                id="inverter_efficiency" 
                type="number" 
                min="80" 
                max="100" 
                step="0.1" 
                value={config.inverter_params.efficiency} 
                onChange={(e) => handleInputChange('inverter_params', 'efficiency', e.target.value)}
                className="mt-1 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Losses */}
      <Card className="shadow-lg border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-3 text-slate-900">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <span>System Losses (%)</span>
          </CardTitle>
          <CardDescription>Configure expected system losses.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          {Object.keys(config.loss_params).map((key) => (
            <div key={key}>
              <Label htmlFor={key} className="capitalize text-slate-700 font-medium">{key.replace(/_/g, ' ')}</Label>
              <Input 
                id={key} 
                type="number" 
                step="0.1" 
                value={config.loss_params[key]} 
                onChange={(e) => handleInputChange('loss_params', key, e.target.value)}
                className="mt-1 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit}>
        <Button 
          type="submit" 
          className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-6 h-6 mr-3 animate-spin" />
              <span>Generating Prediction...</span>
            </>
          ) : (
            <>
              <Zap className="w-6 h-6 mr-3" />
              <span>Generate Energy Prediction</span>
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default SystemForm;