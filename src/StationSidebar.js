import React from 'react';
import BUENO from './imagenes/BUENO.gif';
import MODERADO from './imagenes/MODERADO.gif';
import INSALUBREGS from './imagenes/INSALUBREGS.gif';
import INSALUBRE from './imagenes/INSALUBRE.gif';
import MUYINSALUBRE from './imagenes/MUYINSALUBRE.gif';
import humedad from './imagenes/humedad.gif';
import pm25 from './imagenes/PM.gif';
import temp from './imagenes/TEMPERATURA.gif';
import ubi from './imagenes/mapa.gif';

const StationSidebar = ({ station, districtName, measurements, onClose }) => {

  const getAirQualityStatus = (pm25) => {
    if (pm25 <= 50) return { 
      text: 'Buena', 
      color: 'text-green-600', 
      textColor: '#22C55E',
      bgColor: 'bg-green-100',
      icon: BUENO
    };
    if (pm25 <= 100) return { 
      text: 'Moderada', 
      color: 'text-yellow-600', 
      textColor: '#FFD700', 
      bgColor: 'bg-yellow-100',
      icon: MODERADO
    };
    if (pm25 <= 150) return { 
      text: 'Insalubre para Grupos Sensibles', 
      color: 'text-orange-600', 
      textColor: '#EA580C',
      bgColor: 'bg-orange-100',
      icon: INSALUBREGS
    };
    if (pm25 <= 200) return { 
      text: 'Insalubre', 
      color: 'text-red-600', 
      textColor: '#DC2626', 
      bgColor: 'bg-red-100',
      icon: INSALUBRE
    };
    if (pm25 <= 300) return { 
      text: 'Muy Insalubre', 
      color: 'text-purple-600', 
      textColor: '#9333EA',
      bgColor: 'bg-purple-100',
      icon: MUYINSALUBRE
    };
    return { 
      text: 'Peligrosa', 
      color: 'text-gray-600', 
      textColor: '#4B5563',
      bgColor: 'bg-gray-100',
      icon: '/imagenes/peligrosa.gif'
    };
  };

  const airQuality = getAirQualityStatus(measurements.PM2_5 || 0);

  const imageStyle = {
    width: '90px',
    height: '90px',
    objectFit: 'contain'
  };

  return (
    <div className="h-full bg-white p-4 overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h2 className="text-2xl font-bold text-gray-800">     Datos de la Estación</h2>
        <button 
        onClick={onClose}
        style={{
          position: 'absolute', // Posiciona el botón de manera absoluta
          top: '10px', // Ajusta la distancia desde la parte superior
          right: '10px', // Ajusta la distancia desde la derecha
          backgroundColor: '#C0C0C0', // Cambia el color de fondo a verde
          color: 'white',
          padding: '5px',
          borderRadius: '30%', // Hace el botón circular
          cursor: 'pointer'
        }}
      >
        ✕
      </button>
      </div>

      {/* Air Quality Status */}
      <div className={`${airQuality.bgColor} rounded-lg p-4 mb-6 text-center`}>
        <img 
          src={airQuality.icon}
          alt="Air Quality Status"
          style={imageStyle}
          className="mx-auto mb-4"
        />
        <h3 style={{ color: airQuality.textColor }} className="text-xl font-bold">
          {airQuality.text}
        </h3>
      </div>

      {/* Station Info */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-700 mb-4">Información:</h4>
        
        <div className="space-y-1">
          {/* District */}
          <div className="rounded-lg p-2 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <img src={ubi} alt="Distrito" style={{ width: '40px', height: '40px' }} />
              <span className="font-medium">Distrito</span>
            </div>
            <span className="text-gray-600 font-bold">{districtName}</span>
          </div>
        </div>
      </div>

      {/* Measurements */}
      <div className="space-y-1">
        {/* PM2.5 */}
        <div className={`${airQuality.bgColor} rounded-lg p-2 flex items-center justify-between`}>
          <div className="flex items-center gap-1">
            <img src={pm25} alt="PM2.5" style={{ width: '40px', height: '40px' }} />
            <span className="font-medium">PM2.5</span>
          </div>
          <span className={`${airQuality.color} font-bold`}>{measurements.PM2_5 || 0} µg/m³</span>
        </div>

        {/* Temperature */}
        <div className="bg-blue-50 rounded-lg p-2 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <img src={temp} alt="Temperatura" style={{ width: '40px', height: '40px' }} />
            <span className="font-medium">Temperatura</span>
          </div>
          <span className="text-blue-600 font-bold">{measurements.Temperature || 0}°C</span>
        </div>

        {/* Humidity */}
        <div className="bg-teal-50 rounded-lg p-2 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <img src={humedad} alt="Humedad" style={{ width: '40px', height: '40px' }} />
            <span className="font-medium">Humedad</span>
          </div>
          <span className="text-teal-600 font-bold">{measurements.Humidity || 0}%</span>
        </div>
      </div>
    </div>
  );
};

export default StationSidebar;


