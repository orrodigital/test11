import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Prevent SSR issues with Leaflet
if (typeof window !== 'undefined') {

  // Fix for default markers in React Leaflet
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  });
}

// Custom weather marker icon
const weatherIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC44KSIvPgo8c3VuIGN4PSIxNiIgY3k9IjE2IiByPSI2IiBmaWxsPSIjZmZiZjAwIi8+Cjwvc3ZnPg==',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

// Map interaction handlers
function MapController({ onLocationSelect, onSwipe, currentLayer }) {
  const map = useMap();
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      onSwipe('left');
    }
    if (isRightSwipe) {
      onSwipe('right');
    }
  };

  useEffect(() => {
    const mapContainer = map.getContainer();

    // Add touch event listeners
    mapContainer.addEventListener('touchstart', onTouchStart);
    mapContainer.addEventListener('touchmove', onTouchMove);
    mapContainer.addEventListener('touchend', onTouchEnd);

    // Add click handler
    const handleClick = (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelect(lat, lng);
    };

    map.on('click', handleClick);

    return () => {
      mapContainer.removeEventListener('touchstart', onTouchStart);
      mapContainer.removeEventListener('touchmove', onTouchMove);
      mapContainer.removeEventListener('touchend', onTouchEnd);
      map.off('click', handleClick);
    };
  }, [map, onLocationSelect, onSwipe, touchStart, touchEnd]);

  return null;
}

// Map center updater
function MapCenterUpdater({ coordinates }) {
  const map = useMap();

  useEffect(() => {
    if (coordinates) {
      map.setView(coordinates, map.getZoom(), {
        animate: true,
        duration: 1.5
      });
    }
  }, [coordinates, map]);

  return null;
}

// Tile layer selector with live weather overlays
function WeatherTileLayer({ layer }) {
  const getTileLayer = () => {
    switch (layer) {
      case 'satellite':
        return {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          attribution: '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        };
      case 'rain':
        return {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          attribution: '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        };
      case 'forecast':
        return {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          attribution: '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        };
      default:
        return {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          attribution: '&copy; Esri'
        };
    }
  };

  const tileLayer = getTileLayer();

  return (
    <>
      {/* Base satellite layer */}
      <TileLayer
        key={`base-${layer}`}
        url={tileLayer.url}
        attribution={tileLayer.attribution}
        maxZoom={19}
      />
      
      {/* Live weather overlays */}
      {layer === 'satellite' && (
        <>
          {/* Live cloud cover */}
          <TileLayer
            key="clouds"
            url="https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=439d4b804bc8187953eb36d2a8c26a02"
            attribution="Weather data © OpenWeatherMap"
            opacity={0.6}
            maxZoom={19}
          />
        </>
      )}
      
      {layer === 'rain' && (
        <>
          {/* Live precipitation */}
          <TileLayer
            key="precipitation"
            url="https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=439d4b804bc8187953eb36d2a8c26a02"
            attribution="Weather data © OpenWeatherMap"
            opacity={0.8}
            maxZoom={19}
          />
          {/* Add radar overlay */}
          <TileLayer
            key="radar"
            url="https://tilecache.rainviewer.com/v2/radar/0/{z}/{x}/{y}/2/1_1.png"
            attribution="Weather radar © RainViewer"
            opacity={0.6}
            maxZoom={19}
          />
        </>
      )}
      
      {layer === 'forecast' && (
        <>
          {/* Temperature overlay */}
          <TileLayer
            key="temperature"
            url="https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=439d4b804bc8187953eb36d2a8c26a02"
            attribution="Weather data © OpenWeatherMap"
            opacity={0.7}
            maxZoom={19}
          />
        </>
      )}
    </>
  );
}

const FullscreenWeatherMap = ({ 
  coordinates, 
  weatherData, 
  currentLayer, 
  onLocationSelect, 
  onLayerSwipe, 
  loading, 
  error, 
  location 
}) => {
  const mapRef = useRef();
  
  const handleSwipe = useCallback((direction) => {
    onLayerSwipe(direction);
  }, [onLayerSwipe]);

  const getLayerTitle = () => {
    switch (currentLayer) {
      case 'satellite':
        return '🛰️ Live Satellite + Clouds';
      case 'rain':
        return '🌧️ Live Radar + Precipitation';
      case 'forecast':
        return '🌡️ Live Temperature Map';
      default:
        return '🗺️ Map View';
    }
  };

  const getTemperatureDisplay = () => {
    if (!weatherData?.current) return null;
    return (
      <div className="text-4xl font-bold text-white mb-2">
        {Math.round(weatherData.current.temperature)}°F
      </div>
    );
  };

  return (
    <div className="relative h-full w-full">
      {/* Fullscreen Map */}
      <MapContainer
        center={coordinates}
        zoom={10}
        className="h-full w-full"
        zoomControl={false}
        ref={mapRef}
        style={{ background: '#1a1a1a' }}
      >
        <WeatherTileLayer layer={currentLayer} />

        {/* Current location marker */}
        {coordinates && weatherData && (
          <Marker position={coordinates} icon={weatherIcon} />
        )}

        <MapController 
          onLocationSelect={onLocationSelect}
          onSwipe={handleSwipe}
          currentLayer={currentLayer}
        />
        <MapCenterUpdater coordinates={coordinates} />
      </MapContainer>

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-40">
          <div className="bg-black/20 backdrop-blur-md rounded-2xl p-8 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
            <div className="text-white font-medium">Loading weather data...</div>
          </div>
        </div>
      )}

      {/* Error Overlay */}
      {error && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-40">
          <div className="bg-red-500/20 backdrop-blur-md rounded-2xl p-8 text-center max-w-sm mx-4">
            <div className="text-red-100 font-medium mb-2">Weather Error</div>
            <div className="text-red-200 text-sm">{error}</div>
          </div>
        </div>
      )}

      {/* Top Status Bar */}
      <div className="absolute top-4 left-4 right-20 z-30">
        <div className="bg-black/20 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold">
                {location || 'Select Location'}
              </div>
              <div className="text-sm text-white/80">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
            </div>
            <div className="text-right">
              {getTemperatureDisplay()}
              <div className="text-sm text-white/80 capitalize">
                {weatherData?.current?.description || ''}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Layer Indicator */}
      <div className="absolute bottom-20 left-4 right-4 z-30">
        <div className="bg-black/20 backdrop-blur-md border border-white/20 rounded-xl p-4 text-center">
          <div className="text-white font-medium mb-2">
            {getLayerTitle()}
          </div>
          <div className="flex justify-center space-x-2 mb-3">
            {['satellite', 'rain', 'forecast'].map((layer, index) => (
              <div
                key={layer}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  currentLayer === layer 
                    ? 'bg-white' 
                    : 'bg-white/30'
                }`}
              />
            ))}
          </div>
          <div className="text-white/60 text-sm">
            ← Swipe to change layers →
          </div>
        </div>
      </div>

      {/* Mobile Instructions */}
      <div className="absolute bottom-4 left-4 right-4 z-30 lg:hidden">
        <div className="bg-black/10 backdrop-blur-sm rounded-lg p-3 text-center">
          <div className="text-white/80 text-xs">
            Tap anywhere to get weather • Swipe to change views • Rotate to landscape for presenter
          </div>
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="absolute bottom-32 right-4 z-30 space-y-2">
        <button
          onClick={() => mapRef.current?.setZoom(mapRef.current.getZoom() + 1)}
          className="w-12 h-12 bg-black/20 backdrop-blur-md border border-white/20 rounded-xl text-white text-xl font-bold hover:bg-black/30 transition-all duration-200"
        >
          +
        </button>
        <button
          onClick={() => mapRef.current?.setZoom(mapRef.current.getZoom() - 1)}
          className="w-12 h-12 bg-black/20 backdrop-blur-md border border-white/20 rounded-xl text-white text-xl font-bold hover:bg-black/30 transition-all duration-200"
        >
          −
        </button>
      </div>

      {/* Current Weather Quick Info - Mobile */}
      {weatherData?.current && (
        <div className="absolute top-20 left-4 z-30 lg:hidden">
          <div className="bg-black/20 backdrop-blur-md border border-white/20 rounded-xl p-3 text-white min-w-[120px]">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">
                {weatherData.current.condition.includes('rain') ? '🌧️' : 
                 weatherData.current.condition.includes('cloud') ? '☁️' : 
                 weatherData.current.condition.includes('clear') ? '☀️' : '🌤️'}
              </div>
              <div>
                <div className="text-lg font-bold">
                  {Math.round(weatherData.current.temperature)}°
                </div>
                <div className="text-xs text-white/80">
                  Feels {Math.round(weatherData.current.feelsLike)}°
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FullscreenWeatherMap;