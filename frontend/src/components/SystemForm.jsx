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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Location Section - RESTORED */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2"><MapPin className="w-5 h-5" /><span>Location</span></CardTitle>
          <CardDescription>Specify the geographic location of your installation.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="latitude">Latitude (°)</Label>
              <Input id="latitude" type="number" step="0.0001" value={config.location.latitude} onChange={(e) => handleInputChange('location', 'latitude', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="longitude">Longitude (°)</Label>
              <Input id="longitude" type="number" step="0.0001" value={config.location.longitude} onChange={(e) => handleInputChange('location', 'longitude', e.target.value)} />
            </div>
          </div>
          <div>
            <Label htmlFor="altitude">Altitude (m)</Label>
            <Input id="altitude" type="number" value={config.location.altitude} onChange={(e) => handleInputChange('location', 'altitude', e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {/* Array Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2"><Settings className="w-5 h-5" /><span>Array Configuration</span></CardTitle>
          <CardDescription>Configure your solar panel array geometry.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tilt">Tilt Angle (°)</Label>
              <Input id="tilt" type="number" min="0" max="90" value={config.array.tilt} onChange={(e) => handleInputChange('array', 'tilt', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="azimuth">Azimuth (°)</Label>
              <Input id="azimuth" type="number" min="0" max="360" value={config.array.azimuth} onChange={(e) => handleInputChange('array', 'azimuth', e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="modules_per_string">Modules per String</Label>
              <Input id="modules_per_string" type="number" min="1" value={config.array.stringing.modules_per_string} onChange={(e) => handleNestedInputChange('array', 'stringing', 'modules_per_string', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="strings_per_inverter">Strings per Inverter</Label>
              <Input id="strings_per_inverter" type="number" min="1" value={config.array.stringing.strings_per_inverter} onChange={(e) => handleNestedInputChange('array', 'stringing', 'strings_per_inverter', e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Equipment Specifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2"><Zap className="w-5 h-5" /><span>Equipment Specifications</span></CardTitle>
          <CardDescription>Specify your module and inverter parameters.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="module_power">Module Power (W)</Label>
              <Input id="module_power" type="number" min="1" value={config.module_params.power} onChange={(e) => handleInputChange('module_params', 'power', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="temp_coefficient">Temp. Coefficient (%/°C)</Label>
              <Input id="temp_coefficient" type="number" step="0.01" value={config.module_params.temp_coefficient} onChange={(e) => handleInputChange('module_params', 'temp_coefficient', e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="inverter_power">Inverter Power (W)</Label>
              <Input id="inverter_power" type="number" min="1" value={config.inverter_params.power} onChange={(e) => handleInputChange('inverter_params', 'power', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="inverter_efficiency">Inverter Efficiency (%)</Label>
              <Input id="inverter_efficiency" type="number" min="80" max="100" step="0.1" value={config.inverter_params.efficiency} onChange={(e) => handleInputChange('inverter_params', 'efficiency', e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Losses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2"><AlertTriangle className="w-5 h-5" /><span>System Losses (%)</span></CardTitle>
          <CardDescription>Configure expected system losses.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          {Object.keys(config.loss_params).map((key) => (
            <div key={key}>
              <Label htmlFor={key} className="capitalize">{key.replace(/_/g, ' ')}</Label>
              <Input id={key} type="number" step="0.1" value={config.loss_params[key]} onChange={(e) => handleInputChange('loss_params', key, e.target.value)} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Button type="submit" className="w-full h-12 text-lg" disabled={isLoading}>
        {isLoading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Zap className="w-5 h-5 mr-2" />}
        {isLoading ? 'Generating Prediction...' : 'Generate Energy Prediction'}
      </Button>
    </form>
  );
};

export default SystemForm;