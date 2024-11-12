import React from 'react';

const StationSidebar = ({ station, districtName, measurements, onClose }) => {
  // Mover las imágenes a la carpeta public y referenciarlas correctamente
  const pmGif = '/imagenes/pm25.gif';
  const temperaturaGif = '/imagenes/temperatura.gif';
  const humedadGif = '/imagenes/humedad.gif';

  const getAirQualityStatus = (pm25) => {
    if (pm25 <= 50) return { 
      text: 'Buena', 
      color: 'text-green-600', 
      bgColor: 'bg-green-100',
      icon: '/imagenes/BUENO.gif'
    };
    if (pm25 <= 100) return { 
      text: 'Moderada', 
      color: 'text-yellow-600', 
      bgColor: 'bg-yellow-100',
      icon: '/imagenes/MODERADO.gif'
    };
    if (pm25 <= 150) return { 
      text: 'Insalubre para Grupos Sensibles', 
      color: 'text-orange-600', 
      bgColor: 'bg-orange-100',
      icon: '/imagenes/INSALUBRE.gif'
    };
    if (pm25 <= 200) return { 
      text: 'Insalubre', 
      color: 'text-red-600', 
      bgColor: 'bg-red-100',
      icon: '/imagenes/INSALUBREGS.gif'
    };
    if (pm25 <= 300) return { 
      text: 'Muy Insalubre', 
      color: 'text-purple-600', 
      bgColor: 'bg-purple-100',
      icon: '/imagenes/MUYINSALUBRE.gif' 
    };
    return { 
      text: 'Peligrosa', 
      color: 'text-gray-600', 
      bgColor: 'bg-gray-100',
      icon: '/imagenes/peligrosa.gif'
    };
  };

  const airQuality = getAirQualityStatus(measurements.PM2_5 || 0);

  const imageStyle = {
    width: '80px',
    height: '80px',
    objectFit: 'contain'
  };

  return (
    <div className="h-full bg-white p-4 overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">Datos de la Estación</h2>
        <button 
          onClick={onClose}
          className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
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
        <h3 className={`text-xl font-bold ${airQuality.color}`}>
          {airQuality.text}
        </h3>
      </div>

      {/* Station Info */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-700 mb-4">Información:</h4>
        
        <div className="space-y-4">
          {/* District */}
          <div className="rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={humedadGif} alt="Distrito" style={{ width: '40px', height: '40px' }} />
              <span className="font-medium">Distrito</span>
            </div>
            <span className="text-gray-600 font-bold">{districtName}</span>
          </div>
        </div>
      </div>

      {/* Measurements */}
      <div className="space-y-4">
        {/* PM2.5 */}
        <div className={`${airQuality.bgColor} rounded-lg p-4 flex items-center justify-between`}>
          <div className="flex items-center gap-4">
            <img src={pmGif} alt="PM2.5" style={{ width: '40px', height: '40px' }} />
            <span className="font-medium">PM2.5</span>
          </div>
          <span className={`${airQuality.color} font-bold`}>{measurements.PM2_5 || 0} µg/m³</span>
        </div>

        {/* Temperature */}
        <div className="bg-blue-50 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={temperaturaGif} alt="Temperatura" style={{ width: '40px', height: '40px' }} />
            <span className="font-medium">Temperatura</span>
          </div>
          <span className="text-blue-600 font-bold">{measurements.Temperature || 0}°C</span>
        </div>

        {/* Humidity */}
        <div className="bg-teal-50 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={humedadGif} alt="Humedad" style={{ width: '40px', height: '40px' }} />
            <span className="font-medium">Humedad</span>
          </div>
          <span className="text-teal-600 font-bold">{measurements.Humidity || 0}%</span>
        </div>
      </div>
    </div>
  );
};

export default StationSidebar;