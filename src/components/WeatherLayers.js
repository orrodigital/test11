import React, { useState } from 'react';

const WeatherLayers = ({ currentLayer, weatherData, coordinates, onLayerChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const layers = [
    {
      id: 'satellite',
      name: '🛰️ Live Satellite',
      description: 'Satellite imagery with live cloud cover',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'rain',
      name: '🌧️ Live Radar',
      description: 'Real-time precipitation and radar data',
      color: 'from-cyan-500 to-blue-600'
    },
    {
      id: 'forecast',
      name: '🌡️ Temperature',
      description: 'Live temperature overlay mapping',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const handleLayerSelect = (layerId) => {
    onLayerChange(layerId);
    setIsExpanded(false);
  };

  const currentLayerData = layers.find(layer => layer.id === currentLayer);

  const renderForecastLayer = () => {
    if (currentLayer !== 'forecast' || !weatherData?.daily) return null;

    return (
      <div className="absolute inset-0 pointer-events-none z-20">
        <div className="flex flex-col h-full justify-center items-center p-8">
          <div className="bg-black/40 backdrop-blur-md rounded-3xl p-6 max-w-md w-full pointer-events-auto">
            <h3 className="text-white font-bold text-xl mb-4 text-center">7-Day Forecast</h3>
            <div className="space-y-3">
              {weatherData.daily.slice(0, 7).map((day, index) => {
                const date = new Date(day.date);
                const dayName = index === 0 ? 'Today' : 
                               index === 1 ? 'Tomorrow' : 
                               date.toLocaleDateString('en-US', { weekday: 'short' });
                
                const weatherEmoji = day.condition.includes('rain') ? '🌧️' : 
                                   day.condition.includes('cloud') ? '☁️' : 
                                   day.condition.includes('clear') ? '☀️' : '🌤️';

                return (
                  <div key={day.date} className="flex items-center justify-between bg-white/10 rounded-xl p-3">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{weatherEmoji}</div>
                      <div>
                        <div className="text-white font-medium">{dayName}</div>
                        <div className="text-white/70 text-sm capitalize">{day.description}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold">
                        {Math.round(day.temperatureMax)}°
                      </div>
                      <div className="text-white/60 text-sm">
                        {Math.round(day.temperatureMin)}°
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderRainLayer = () => {
    if (currentLayer !== 'rain' || !weatherData?.current) return null;

    const rainInfo = weatherData.current.condition.includes('rain') || 
                    weatherData.current.condition.includes('drizzle');
    
    return (
      <div className="absolute inset-0 pointer-events-none z-20">
        {/* Rain effect overlay - purely visual */}
        {rainInfo && (
          <div className="absolute inset-0 opacity-30">
            {/* Animated rain lines */}
            {Array.from({ length: 50 }, (_, i) => (
              <div
                key={i}
                className="absolute bg-white/20 rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: '2px',
                  height: `${10 + Math.random() * 20}px`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random()}s`
                }}
              />
            ))}
          </div>
        )}

        {/* Rain info card */}
        <div className="absolute top-1/4 left-4 right-4 flex justify-center">
          <div className="bg-black/40 backdrop-blur-md rounded-2xl p-4 max-w-sm pointer-events-auto">
            <div className="text-center text-white">
              <div className="text-4xl mb-2">
                {rainInfo ? '🌧️' : '☀️'}
              </div>
              <div className="font-bold text-lg mb-1">
                {rainInfo ? 'Precipitation Active' : 'No Precipitation'}
              </div>
              <div className="text-white/80 text-sm">
                {weatherData.current.description}
              </div>
              {weatherData.current.humidity && (
                <div className="mt-3 pt-3 border-t border-white/20">
                  <div className="text-sm">
                    Humidity: <span className="font-medium">{weatherData.current.humidity}%</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Layer-specific overlays */}
      {renderForecastLayer()}
      {renderRainLayer()}

      {/* Layer Selector - Bottom Left */}
      <div className="absolute bottom-4 left-4 z-40">
        <div className="bg-black/20 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden">
          {/* Current Layer Display */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-3 p-4 text-white hover:bg-white/10 transition-all duration-200 w-full min-w-[200px]"
          >
            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${currentLayerData?.color}`} />
            <div className="flex-1 text-left">
              <div className="font-medium">{currentLayerData?.name}</div>
              <div className="text-xs text-white/70">{currentLayerData?.description}</div>
            </div>
            <svg className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Layer Options */}
          {isExpanded && (
            <div className="border-t border-white/20">
              {layers.filter(layer => layer.id !== currentLayer).map((layer) => (
                <button
                  key={layer.id}
                  onClick={() => handleLayerSelect(layer.id)}
                  className="flex items-center space-x-3 p-4 text-white hover:bg-white/10 transition-all duration-200 w-full"
                >
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${layer.color}`} />
                  <div className="flex-1 text-left">
                    <div className="font-medium">{layer.name}</div>
                    <div className="text-xs text-white/70">{layer.description}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick tip */}
        <div className="mt-2 text-center">
          <div className="text-white/60 text-xs bg-black/10 backdrop-blur-sm rounded-lg px-3 py-1">
            Swipe or tap to change layers
          </div>
        </div>
      </div>

      {/* Layer Navigation Dots - Mobile */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-30 lg:hidden">
        <div className="flex space-x-3 bg-black/20 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
          {layers.map((layer, index) => (
            <button
              key={layer.id}
              onClick={() => handleLayerSelect(layer.id)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                currentLayer === layer.id 
                  ? `bg-gradient-to-r ${layer.color}` 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Switch to ${layer.name}`}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default WeatherLayers;