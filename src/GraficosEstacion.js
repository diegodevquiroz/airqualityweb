import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Line } from 'react-chartjs-2';
import { X } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return createPortal(
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "20px",
          width: "80%",
          maxWidth: "600px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>{title}</h2>
          <button onClick={onClose} aria-label="Cerrar" style={{ border: "none", background: "none" }}>
            <X style={{ width: "24px", height: "24px", cursor: "pointer" }} />
          </button>
        </div>
        <div style={{ marginTop: "10px", height: "300px" }} className="chart-container">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

const GraficosEstacion = ({ districtName, measurements }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGraph, setSelectedGraph] = useState(null);
  const [historialMediciones, setHistorialMediciones] = useState({
    'PM2.5': [],
    'Temperature': [],
    'Humidity': []
  });

  useEffect(() => {
    if (!Array.isArray(measurements)) return;

    setHistorialMediciones(prevHistorial => {
      const newHistorial = { ...prevHistorial };
      
      measurements.forEach(medicionGrupo => {
        if (Array.isArray(medicionGrupo)) {
          medicionGrupo.forEach(medicion => {
            const { measurementType, measurementValue, timestamp } = medicion;
            if (measurementType in newHistorial) {
              const existeTimestamp = newHistorial[measurementType].some(
                m => m.timestamp === timestamp
              );
              
              if (!existeTimestamp) {
                newHistorial[measurementType].push({
                  valor: Number(measurementValue),
                  timestamp: timestamp || new Date().toISOString(),
                });
              }
            }
          });
        }
      });

      Object.keys(newHistorial).forEach(tipo => {
        newHistorial[tipo] = newHistorial[tipo]
          .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
          .slice(-20);
      });

      return newHistorial;
    });
  }, [measurements]);

  const obtenerDatos = (tipo) => {
    const datos = historialMediciones[tipo] || [];
    return {
      valores: datos.map(d => d.valor),
      etiquetas: datos.map((_, i) => `Medición ${i + 1}`)
    };
  };

  const createChartConfig = (datos, label, color, bgColor, yAxisMax, yAxisLabel, yAxisStepSize) => ({
    data: {
      labels: datos.etiquetas,
      datasets: [
        {
          label,
          data: datos.valores,
          borderColor: color,
          backgroundColor: bgColor,
          borderWidth: 2,
          pointRadius: 4,
          fill: true,
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: label },
      },
      scales: {
        y: { 
          beginAtZero: true, 
          max: yAxisMax, 
          title: { display: true, text: yAxisLabel },
          ticks: {
            stepSize: yAxisStepSize
          }
        },
        x: { ticks: { autoSkip: true, maxTicksLimit: 10 } }
      }
    }
  });

  const handleGraphClick = (graphType) => {
    setSelectedGraph(graphType);
    setModalOpen(true);
  };

  const getModalContent = () => {
    switch (selectedGraph) {
      case 'PM2.5':
        return <Line {...createChartConfig(obtenerDatos('PM2.5'), 'Niveles de PM2.5', 'rgb(255, 99, 132)', 'rgba(255, 99, 132, 0.5)', 600, 'µg/m³', 25)} height={300} />;
      case 'Temperature':
        return <Line {...createChartConfig(obtenerDatos('Temperature'), 'Temperatura', 'rgb(53, 162, 235)', 'rgba(53, 162, 235, 0.5)', 40, '°C',5)} height={300} />;
      case 'Humidity':
        return <Line {...createChartConfig(obtenerDatos('Humidity'), 'Humedad', 'rgb(75, 192, 192)', 'rgba(75, 192, 192, 0.5)', 100, '%',10)} height={300} />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="w-full max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-2xl font-bold mb-6">{districtName}</h3>
          <div className="flex justify-center space-x-4">
            <button onClick={() => handleGraphClick('PM2.5')} className="px-4 py-2 bg-gray-200 rounded-lg">PM2.5</button>
            <button onClick={() => handleGraphClick('Temperature')} className="px-4 py-2 bg-gray-200 rounded-lg">Temperatura</button>
            <button onClick={() => handleGraphClick('Humidity')} className="px-4 py-2 bg-gray-200 rounded-lg">Humedad</button>
          </div>
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={`Gráfico de ${selectedGraph}`}>
        {getModalContent()}
      </Modal>
    </>
  );
};

export default GraficosEstacion;