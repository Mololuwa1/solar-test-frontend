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
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 p-12">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-white" />
            </div>
            <div className="absolute inset-0 w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-ping opacity-20"></div>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-slate-800 mb-2">Generating Energy Prediction</p>
            <p className="text-slate-600">Analyzing your solar system configuration...</p>
          </div>
        </div>
      </div>
    );
  }

  // 2. Handle error state
  if (error) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-red-200/60 p-12">
        <div className="flex flex-col items-center justify-center space-y-6 text-red-600">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-red-800 mb-2">Prediction Failed</p>
            <p className="text-sm text-red-600 max-w-md">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // 3. Handle initial empty state
  if (!results) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 p-12">
        <div className="flex flex-col items-center justify-center space-y-6 text-slate-500">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
            <BarChart3 className="w-8 h-8" />
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-slate-800 mb-2">Ready for Analysis</p>
            <p className="text-sm text-slate-600 max-w-md">
              Configure your solar system parameters and generate a prediction to view detailed energy forecasts and performance metrics.
            </p>
          </div>
        </div>
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
    <div className="space-y-8 animate-fade-in">
      {/* Dashboard Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Energy Prediction Results</h2>
        <p className="text-blue-100">Comprehensive analysis of your solar system performance</p>
      </div>
      
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-lg border-slate-200/60 bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700">Annual Energy Production</CardTitle>
            <div className="p-2 bg-green-100 rounded-lg">
              <Zap className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700 mb-1">
              {safeToFixed(annualEnergy, 2)} kWh
            </div>
            <p className="text-xs text-green-600 font-medium">Total yearly output</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg border-slate-200/60 bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700">Performance Ratio</CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700 mb-1">
              {safeToFixed(results.performance_ratio * 100, 1)}%
            </div>
            <p className="text-xs text-blue-600 font-medium">System efficiency</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg border-slate-200/60 bg-gradient-to-br from-orange-50 to-amber-50 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700">Peak Production Month</CardTitle>
            <div className="p-2 bg-orange-100 rounded-lg">
              <Calendar className="h-5 w-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-700 mb-1">{peakMonthName}</div>
            <p className="text-xs text-orange-600 font-medium">{safeToFixed(peakMonthValue, 0)} kWh peak output</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg border-slate-200/60 bg-gradient-to-br from-red-50 to-rose-50 hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700">System Losses</CardTitle>
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-700 mb-1">{safeToFixed(totalLosses, 0)} kWh</div>
            <p className="text-xs text-red-600 font-medium">{safeToFixed(systemEfficiency, 1)}% overall efficiency</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Card className="shadow-lg border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-slate-900">Monthly Energy Production</CardTitle>
          <CardDescription className="text-slate-600">Energy output throughout the year</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 p-4">
            <Bar 
              data={monthlyChartData} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: 'rgba(148, 163, 184, 0.1)'
                    }
                  },
                  x: {
                    grid: {
                      display: false
                    }
                  }
                }
              }} 
            />
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-slate-900">Energy Loss Analysis</CardTitle>
          <CardDescription className="text-slate-600">Breakdown of system losses by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex justify-center p-4">
            <div className="w-full max-w-sm">
              <Doughnut 
                data={lossChartData} 
                options={{ 
                  responsive: true, 
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: {
                          size: 12
                        }
                      }
                    }
                  }
                }} 
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsDashboard;