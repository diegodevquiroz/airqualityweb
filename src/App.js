import React, { useEffect, useState } from 'react';
import Loader from './Loader';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './App.css';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import GraficosEstacion from './GraficosEstacion';
import pmGif from './imagenes/PM.gif';
import temperaturaGif from './imagenes/TEMPERATURA.gif';
import humedadGif from './imagenes/humedad.gif';
import StationSidebar from './StationSidebar';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
const apiUrl = 'http://api.canair.io:8080';

// Componente CustomPopup
const CustomPopup = ({ station, districtName, measurements }) => {
  const getAirQualityStatus = (pm25) => {
    if (pm25 <= 50) return { text: 'Buena', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (pm25 <= 100) return { text: 'Moderada', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    if (pm25 <= 150) return { text: 'Insalubre para Grupos Sensibles', color: 'text-orange-600', bgColor: 'bg-orange-100' };
    if (pm25 <= 200) return { text: 'Insalubre', color: 'text-red-600', bgColor: 'bg-red-100' };
    if (pm25 <= 300) return { text: 'Muy Insalubre', color: 'text-purple-600', bgColor: 'bg-purple-100' };
    return { text: 'Peligrosa', color: 'text-gray-600', bgColor: 'bg-gray-100' };
  };

  const pm25Value = measurements.PM2_5 || 0;
  const airQuality = getAirQualityStatus(pm25Value);

  const imageStyle = {
    width: '40px',
    height: '40px',
    objectFit: 'contain'
  };

  const containerStyle = {
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  return (
    <Popup className="custom-popup">
    <div className="w-72 p-4 rounded-lg shadow-lg bg-white">
     {/* Nombre del distrito centrado */}
      <div className="text-center mb-3">
       <h3 className="font-bold text-lg text-gray-800">{districtName}</h3>
    </div>

        {/* Información de mediciones */}
        <div className="space-y-4">
          <div className={`flex items-center justify-between mb-2 ${airQuality.bgColor} rounded-lg p-3`}>
            <div className="flex items-center space-x-1">
              <div style={containerStyle}>
                <img 
                  src={pmGif}
                  alt="PM2.5"
                  style={imageStyle}
                />
              </div>
              <span className="font-medium mr-2">PM2.5</span>
            </div>
            <div className="text-right">
              <span className={`${airQuality.color} font-bold`}>{pm25Value} µg/m³</span>
              <p className={`text-sm ${airQuality.color}`}>{airQuality.text}</p>
            </div>
          </div>

          {/* Temperatura */}
          <div className="flex items-center justify-between bg-blue-50 rounded-lg p-3">
            <div className="flex items-center space-x-1">
              <div style={containerStyle}>
                <img 
                  src={temperaturaGif}
                  alt="Temperatura"
                  style={imageStyle}
                />
              </div>
              <span className="font-medium" style={{ minWidth: '100px' }}>Temperatura</span>
            </div>
            <span className="text-blue-600 font-bold">
              {measurements.Temperature || 0}°C
            </span>
          </div>
          {/* Humedad */}
          <div className="flex items-center justify-between bg-teal-50 rounded-lg p-3">
            <div className="flex items-center">
              <div style={containerStyle}>
                <img 
                  src={humedadGif}
                  alt="Humedad"
                  style={imageStyle}
                />
              </div>
              <span className="font-medium mr-2">Humedad</span> {/* margen derecho agregado */}
            </div>
            <span className="text-teal-600 font-bold">
              {measurements.Humidity || 0}%
            </span>
          </div>
        </div>
      </div>
    </Popup>
  );
};
const App = () => {
  const [stations, setStations] = useState([]);

  const [currentLocation, setCurrentLocation] = useState(null);
  const [districts, setDistricts] = useState({});
  const [selectedStation, setSelectedStation] = useState(null);

  const [loading, setLoading] = useState(true);
 
  const [showSidebar, setShowSidebar] = useState(false);
 
  

  const fetchDistrictName = async (latitude, longitude) => {
    try {
      // Usar Nominatim en lugar de OpenCage
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`;
      
      // Agregar un User-Agent como lo requiere Nominatim
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'AirQualityMonitor/1.0',
        }
      });
  
      if (!response.ok) {
        console.error('Error en la respuesta de Nominatim:', response.status);
        return 'Desconocido';
      }
      
      const data = await response.json();
      console.log('Nominatim Response:', data); // Para debugging
      
      if (data.address) {
        // Intentar obtener el nombre del distrito/área en este orden de prioridad
        const districtName = 
          data.address.suburb || 
          data.address.neighbourhood || 
          data.address.district || 
          data.address.city_district ||
          data.address.borough ||
          (data.address.city ? `${data.address.city}` : null) ||
          'Desconocido';
          
        console.log('Distrito encontrado:', districtName);
        return districtName;
      }
      
      console.error('No se encontraron resultados en la respuesta de Nominatim');
      return 'Desconocido';
    } catch (error) {
      console.error('Error al obtener el distrito:', error);
      return 'Desconocido';
    }
  };

const fetchStations = async () => {
setLoading(true);
try {
  const response = await fetch('/dwc/stations');
  if (response.ok) {
    const data = await response.json();
    console.log("Stations data:", data); // Imprime los datos de estaciones en consola
    setStations(data);
  } else {

  }
} catch (error) {
 
} finally {
  setLoading(false);
}
};


  const watchCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation([latitude, longitude]);
        },
        (error) => {
       
        },
        {
          enableHighAccuracy: true,
          maximumAge: 10000,
          timeout: 5000
        }
      );
    } else {
     
    }
  };

  useEffect(() => {
    fetchStations();
    watchCurrentLocation();
    const interval = setInterval(fetchStations, 300000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchDistricts = async () => {
      const newDistricts = {};
      for (const station of stations) {
        const latitude = station['decimalLatitude '] || station.decimalLatitude;
        const longitude = station['decimalLongitude '] || station.decimalLongitude;
        
        if (latitude !== undefined && longitude !== undefined) {
          // Delay de 1 segundo entre peticiones para respetar los límites de Nominatim
          await new Promise(resolve => setTimeout(resolve, 1000));
          const districtName = await fetchDistrictName(latitude, longitude);
          if (districtName !== 'Desconocido') {
            newDistricts[station.id] = districtName;
          }
        }
      }
      setDistricts(newDistricts);
    };
  
    if (stations.length > 0) {
      fetchDistricts();
    }
  }, [stations]);

  if (loading) {
    return <Loader />;
  }

  const getLatestMeasurements = (measurements) => {
    if (!Array.isArray(measurements) || measurements.length === 0) return {};
    const latestMeasurements = measurements[measurements.length - 1];
    const relevantMeasurements = {};
    
    if (Array.isArray(latestMeasurements)) {
      latestMeasurements.forEach((measurement) => {
        if (measurement.measurementType === 'PM2.5') {
          relevantMeasurements.PM2_5 = measurement.measurementValue;
        }
        if (measurement.measurementType === 'Temperature') {
          relevantMeasurements.Temperature = measurement.measurementValue;
        }
        if (measurement.measurementType === 'Humidity') {
          relevantMeasurements.Humidity = measurement.measurementValue;
        }
      });
    }
    
    return relevantMeasurements;
  };

  const getMarkerColor = (value) => {
    const numericValue = Number(parseFloat(value).toFixed(2));
    
    if (isNaN(numericValue)) {
      return 'grey';
    }
  
    if (numericValue <= 50) return 'green';
    if (numericValue <= 100) return 'yellow';
    if (numericValue <= 150) return 'orange';
    if (numericValue <= 200) return 'red';
    if (numericValue <= 300) return 'purple';
    return 'grey';
  };

  const createMarker = (station) => {
    const latitude = station['decimalLatitude '] || station.decimalLatitude;
    const longitude = station['decimalLongitude '] || station.decimalLongitude;
  
    if (latitude !== undefined && longitude !== undefined) {
      const position = [latitude, longitude];
      const latestMeasurements = getLatestMeasurements(station.measurements);
      const PM2_5 = latestMeasurements.PM2_5 || 0;
      const markerColor = getMarkerColor(PM2_5);
      const districtName = districts[station.id] || 'Cargando...';

      const customIcon = L.divIcon({
        className: 'custom-marker-icon',
        html: `
          <div style="
            background-color: ${markerColor};
            width: 36px;
            height: 36px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
          ">
            <div style="
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 12px;
              height: 12px;
              background: white;
              border-radius: 50%;
            "></div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -20]
      });
  
      return (
        <Marker
          position={position}
          key={station.id}
          icon={customIcon}
          eventHandlers={{
            click: () => {
              setSelectedStation({ station, districtName });
              
              setShowSidebar(true);
            },
          }}
        >
          <CustomPopup 
            station={station} 
            districtName={districtName}
            measurements={latestMeasurements}
          />
        </Marker>
      );
    }
    return null;
  };
  
  const handleCloseSidebar = () => {
    setShowSidebar(false);
    setSelectedStation(null);
  };

  const Legend = () => (
    <div className="legend">
      <div className="legend-title">
        <h4>ESTADO DE LA CALIDAD<br />DEL AIRE</h4>
      </div>
      <div><span className="legend-color" style={{ backgroundColor: 'green' }}></span>BUENA</div>
      <div><span className="legend-color" style={{ backgroundColor: 'yellow' }}></span>MODERADA</div>
      <div><span className="legend-color" style={{ backgroundColor: 'orange' }}></span>INSALUBRE PARA<br />GRUPOS SENSIBLES</div>
      <div><span className="legend-color" style={{ backgroundColor: 'red' }}></span>INSALUBRE</div>
      <div><span className="legend-color" style={{ backgroundColor: 'purple' }}></span>MUY INSALUBRE</div>
    </div>
  );

  return (
    <div className="App">
      <div className="header">
        <h1>Estaciones de calidad del aire</h1>
      </div>
      <div id="map" style={{ display: 'flex' }}>
        <MapContainer 
          center={[3.428996, -76.523869]} 
          zoom={12} 
          style={{ height: '100%', width: '100%' }}
          
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {stations.map(createMarker)}
          {currentLocation && (
            <Marker 
              position={currentLocation} 
              icon={L.divIcon({
                className: 'custom-location-marker',
                html: `
                  <div class="pulse">
                    <div class="pulse-inner"></div>
                  </div>
                `,
                iconSize: [50, 50],
                iconAnchor: [25, 25],
                popupAnchor: [0, -25],
              })}
              zIndexOffset={1000}
            />
          )}
        </MapContainer>
        {showSidebar && selectedStation && (
        <div className="sidebar">
          <StationSidebar 
            station={selectedStation.station}
            districtName={selectedStation.districtName}
            measurements={getLatestMeasurements(selectedStation.station.measurements)}
            onClose={handleCloseSidebar}
            />
            <div>
              <GraficosEstacion measurements={selectedStation.station.measurements} />
            </div>
          </div>
        )}
      </div>
      <Legend />
    </div>
  );
};

export default App;