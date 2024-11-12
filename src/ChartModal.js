import React from 'react';
import { X } from 'lucide-react';
import { Line } from 'react-chartjs-2';

const ChartModal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl h-[80vh] shadow-2xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        <div className="p-6 h-[calc(80vh-80px)] overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

const StationCharts = ({ station, onClose }) => {
  const [activeChart, setActiveChart] = React.useState('PM2.5');
  
  const getLatestMeasurements = (measurements) => {
    if (!Array.isArray(measurements) || measurements.length === 0) return [];
    return measurements.map(measurement => {
      if (Array.isArray(measurement)) {
        return measurement.map(m => ({
          type: m.measurementType,
          value: m.measurementValue,
          timestamp: m.timestamp
        }));
      }
      return [];
    }).flat();
  };

  const measurements = getLatestMeasurements(station?.measurements);

  const chartData = {
    'PM2.5': {
      data: measurements.filter(m => m.type === 'PM2.5'),
      color: 'rgb(255, 99, 132)',
      label: 'PM2.5 (µg/m³)'
    },
    'Temperature': {
      data: measurements.filter(m => m.type === 'Temperature'),
      color: 'rgb(53, 162, 235)',
      label: 'Temperatura (°C)'
    },
    'Humidity': {
      data: measurements.filter(m => m.type === 'Humidity'),
      color: 'rgb(75, 192, 192)',
      label: 'Humedad (%)'
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${activeChart} en el tiempo`
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: chartData[activeChart].label
        }
      }
    }
  };

  const chartConfig = {
    labels: chartData[activeChart].data.map((_, idx) => `Medición ${idx + 1}`),
    datasets: [
      {
        label: chartData[activeChart].label,
        data: chartData[activeChart].data.map(m => m.value),
        borderColor: chartData[activeChart].color,
        backgroundColor: chartData[activeChart].color.replace(')', ', 0.5)'),
        borderWidth: 2,
        fill: true,
        tension: 0.4
      }
    ]
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex space-x-4 mb-6">
        {Object.keys(chartData).map((type) => (
          <button
            key={type}
            onClick={() => setActiveChart(type)}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeChart === type
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            {type}
          </button>
        ))}
      </div>
      <div className="flex-1 min-h-0">
        <Line data={chartConfig} options={chartOptions} />
      </div>
    </div>
  );
};

export default {ChartModal, StationCharts};