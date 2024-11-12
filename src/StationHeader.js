import React from 'react';

const StationHeader = ({ 
  isVisible, 
  onClose, 
  data = {
    distrito: 'XXXX',
    pm25: 'XXXX',
    temperatura: 'XXXX',
    humedad: 'XXXX'
  } 
}) => {
  if (!isVisible) return null;

  const getAirQualityStatus = (pm25) => {
    if (pm25 <= 50) return 'BUENA';
    if (pm25 <= 100) return 'MODERADA';
    if (pm25 <= 150) return 'INSALUBRE PARA GRUPOS SENSIBLES';
    if (pm25 <= 200) return 'INSALUBRE';
    if (pm25 <= 300) return 'MUY INSALUBRE';
    return 'PELIGROSA';
  };

  const getStatusColor = (status) => {
    const colors = {
      'BUENA': 'green',
      'MODERADA': '#f0ad4e',
      'INSALUBRE PARA GRUPOS SENSIBLES': 'orange',
      'INSALUBRE': 'red',
      'MUY INSALUBRE': 'purple',
      'PELIGROSA': 'gray'
    };
    return colors[status] || 'black';
  };

  const status = getAirQualityStatus(data.pm25);

  return (
    <div style={{
      position: 'absolute',
      right: '10px',
      top: '10px',
      width: '300px',
      backgroundColor: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      borderRadius: '4px',
      zIndex: 1000
    }}>
      <div style={{
        padding: '15px',
        borderBottom: '1px solid #eee'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '10px'
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '16px',
            fontWeight: 'bold'
          }}>
            DATOS DE ESTACION
          </h2>
          <button 
            onClick={onClose}
            style={{
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontSize: '18px'
            }}
          >
            ×
          </button>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '10px'
        }}>
          <span style={{
            color: getStatusColor(status),
            fontWeight: 'bold'
          }}>
            {status}
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: '5px',
          fontSize: '14px'
        }}>
          <span>DISTRITO:</span>
          <span>{data.distrito}</span>
          <span>PM 2.5:</span>
          <span>{data.pm25} µg/m³</span>
          <span>TEMPERATURA:</span>
          <span>{data.temperatura}°C</span>
          <span>HUMEDAD:</span>
          <span>{data.humedad}%</span>
        </div>
      </div>

      <div style={{
        padding: '15px',
        fontSize: '12px'
      }}>
        <p style={{ marginBottom: '10px' }}>
          <strong>Cuidados:</strong> La calidad del aire es satisfactoria y no representa un
          riesgo para la salud.
        </p>
        <p>
          <strong>Recomendaciones:</strong> La calidad del aire es aceptable y cumple con
          el ECA de Aire. Puede realizar actividades al aire libre.
        </p>
      </div>
    </div>
  );
};

export default StationHeader;