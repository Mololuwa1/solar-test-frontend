import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { TrendingUp, Zap, Calendar, AlertTriangle, Loader2, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

// A helper function to safely format numbers
const safeToFixed = (num, digits = 1) => {
  const number = Number(num);
  if (isNaN(number)) {
    return 'N/A';
  }
  return number.toFixed(digits);
};

const ResultsDashboard = ({ results, isLoading, error }) => {
  // 1. Handle loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-gray-600">Generating energy prediction...</p>
      </div>
    );
  }

  // 2. Handle error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4 text-red-500">
        <AlertTriangle className="w-12 h-12" />
        <p className="text-lg font-medium">An Error Occurred</p>
        <p className="text-sm text-center">{error}</p>
      </div>
    );
  }

  // 3. Handle initial empty state
  if (!results) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4 text-gray-500">
        <BarChart3 className="w-12 h-12" />
        <p className="text-lg font-medium">No prediction results yet</p>
        <p className="text-sm text-center">
          Configure your solar system and click "Generate Energy Prediction" to see results.
        </p>
      </div>
    );
  }

  // 4. If we have results, prepare all data for rendering safely
  const monthlyChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Monthly Energy Production (kWh)',
      data: results.monthly_energy_kwh || [],
      backgroundColor: 'rgba(59, 130, 246, 0.8)',
    }],
  };

  const lossData = results.loss_breakdown_kwh || {};
  const lossLabels = Object.keys(lossData).map(key => key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
  const lossValues = Object.values(lossData);

  const lossChartData = {
    labels: lossLabels,
    datasets: [{
      data: lossValues,
      backgroundColor: ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#ec4899'],
    }],
  };

  const totalLosses = lossValues.reduce((sum, loss) => sum + (Number(loss) || 0), 0);
  const annualEnergy = Number(results.annual_energy_kwh) || 0;
  const denominator = annualEnergy + totalLosses;
  const systemEfficiency = denominator !== 0 ? ((annualEnergy / denominator) * 100) : 0;

  const monthlyEnergy = results.monthly_energy_kwh || [];
  const peakMonthValue = monthlyEnergy.length > 0 ? Math.max(...monthlyEnergy) : 0;
  const peakMonthIndex = monthlyEnergy.indexOf(peakMonthValue);
  const peakMonthName = peakMonthIndex !== -1 ? monthlyChartData.labels[peakMonthIndex] : 'N/A';

  // 5. Finally, return the JSX to display the dashboard
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Annual Energy</CardTitle>
            <Zap className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {safeToFixed(annualEnergy, 2)} kWh
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance Ratio</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {safeToFixed(results.performance_ratio * 100, 1)}%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peak Month</CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{peakMonthName}</div>
            <p className="text-xs text-muted-foreground">{safeToFixed(peakMonthValue, 0)} kWh</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Losses</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{safeToFixed(totalLosses, 0)} kWh</div>
            <p className="text-xs text-muted-foreground">{safeToFixed(systemEfficiency, 1)}% efficiency</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Card>
        <CardHeader><CardTitle>Monthly Energy Production</CardTitle></CardHeader>
        <CardContent><div className="h-80"><Bar data={monthlyChartData} options={{ responsive: true, maintainAspectRatio: false }} /></div></CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Energy Loss Analysis</CardTitle></CardHeader>
        <CardContent><div className="h-80 flex justify-center"><div className="w-full max-w-xs"><Doughnut data={lossChartData} options={{ responsive: true, maintainAspectRatio: false }} /></div></div></CardContent>
      </Card>
    </div>
  );
};

export default ResultsDashboard;