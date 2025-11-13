import React, { useState, useEffect } from 'react';

/**
 * Mobile Presenter Component
 * 
 * This component appears when mobile devices are rotated to landscape mode.
 * It provides a female model presenter placeholder for future AI/Unreal integration.
 * 
 * Features:
 * - Only visible in landscape mode on mobile/tablet
 * - Full presenter interface with controls
 * - Weather-responsive animations
 * - Ready for video integration
 */

const MobilePresenter = ({ weatherData, isVisible }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState('idle');

  // Update animation based on weather conditions
  useEffect(() => {
    if (weatherData?.current) {
      const temp = weatherData.current.temperature;
      const condition = weatherData.current.condition;
      
      // Weather-responsive animations
      if (temp > 80) {
        setCurrentAnimation('hot_weather_gesture');
      } else if (temp < 40) {
        setCurrentAnimation('cold_weather_shiver');
      } else if (condition.includes('rain')) {
        setCurrentAnimation('rain_pointing');
      } else if (condition.includes('clear')) {
        setCurrentAnimation('sunny_welcome');
      } else {
        setCurrentAnimation('idle_breathing');
      }
    }
  }, [weatherData]);

  // Auto-play when presenter becomes visible
  useEffect(() => {
    if (isVisible && weatherData) {
      setIsPlaying(true);
    }
  }, [isVisible, weatherData]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
  };

  const getWeatherScript = () => {
    if (!weatherData?.current) return "Welcome! I'm ready to present the weather for you.";
    
    const temp = Math.round(weatherData.current.temperature);
    const condition = weatherData.current.description;
    const location = weatherData.location?.name;
    
    const scripts = [
      `Hello! It's currently ${temp} degrees in ${location} with ${condition}.`,
      `The weather today shows ${condition} with a temperature of ${temp} degrees.`,
      `Good day! I'm seeing ${condition} conditions and ${temp} degrees for ${location}.`,
      `Welcome to your weather update! Current conditions show ${temp} degrees with ${condition}.`
    ];
    
    return scripts[Math.floor(Math.random() * scripts.length)];
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)`
        }} />
      </div>

      {/* Main Presenter Area */}
      <div className="relative flex items-center justify-center w-full h-full p-8">
        <div className="flex items-center space-x-8 max-w-6xl w-full">
          
          {/* Presenter Avatar */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              {/* Main presenter container */}
              <div className="aspect-[3/4] bg-gradient-to-b from-white/10 to-white/5 rounded-3xl border border-white/20 backdrop-blur-sm overflow-hidden relative">
                
                {/* Presenter placeholder - Female model silhouette */}
                <div className="absolute inset-0 flex items-end justify-center">
                  <div className="relative w-full h-full">
                    {/* Female presenter silhouette */}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-48 bg-gradient-to-t from-white/30 to-white/10 rounded-t-full" 
                         style={{ clipPath: 'ellipse(60% 100% at 50% 100%)' }}>
                      {/* Head */}
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-white/20 rounded-full" />
                      {/* Hair */}
                      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-16 h-8 bg-white/15 rounded-t-full" />
                    </div>
                  </div>
                </div>

                {/* Animation overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`w-full h-full ${isPlaying ? 'animate-pulse-slow' : ''}`}>
                    {/* Gesture indicators */}
                    {currentAnimation.includes('pointing') && (
                      <div className="absolute right-8 top-1/3 w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
                    )}
                    {currentAnimation.includes('gesture') && (
                      <div className="absolute left-8 top-1/2 w-1 h-1 bg-blue-400 rounded-full animate-bounce" />
                    )}
                  </div>
                </div>

                {/* Status indicator */}
                <div className="absolute top-4 left-4">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    isPlaying 
                      ? 'bg-green-500/80 text-white' 
                      : 'bg-gray-500/80 text-white'
                  }`}>
                    {isPlaying ? 'LIVE' : 'READY'}
                  </div>
                </div>

                {/* Animation name */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/40 backdrop-blur-sm rounded-lg px-3 py-1 text-center">
                    <div className="text-white/90 text-sm font-medium capitalize">
                      {currentAnimation.replace(/_/g, ' ')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Presenter Controls */}
              <div className="absolute -bottom-4 left-4 right-4 flex justify-center space-x-4">
                <button
                  onClick={handlePlayPause}
                  className="p-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-full hover:bg-white/30 transition-all duration-200"
                >
                  {isPlaying ? (
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  )}
                </button>
                
                <button
                  onClick={handleMute}
                  className="p-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-full hover:bg-white/30 transition-all duration-200"
                >
                  {isMuted ? (
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5.764a.5.5 0 01.707-.707L17 8.35a.5.5 0 010 .707l-3.293 3.293a.5.5 0 01-.707-.707L15.586 9 13 6.414a.5.5 0 010-.707z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Weather Information Panel */}
          <div className="flex-1 max-w-lg space-y-6">
            
            {/* Current Weather */}
            {weatherData?.current && (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="text-center">
                  <div className="text-6xl mb-4">
                    {weatherData.current.condition.includes('rain') ? '🌧️' : 
                     weatherData.current.condition.includes('cloud') ? '☁️' : 
                     weatherData.current.condition.includes('clear') ? '☀️' : '🌤️'}
                  </div>
                  <div className="text-4xl font-bold text-white mb-2">
                    {Math.round(weatherData.current.temperature)}°F
                  </div>
                  <div className="text-white/80 text-lg capitalize mb-4">
                    {weatherData.current.description}
                  </div>
                  <div className="text-white/60">
                    Feels like {Math.round(weatherData.current.feelsLike)}°F
                  </div>
                </div>
              </div>
            )}

            {/* Weather Script */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="text-white/70 text-sm mb-2 font-medium">
                Presenter Script:
              </div>
              <div className="text-white text-sm leading-relaxed">
                "{getWeatherScript()}"
              </div>
            </div>

            {/* Quick Stats */}
            {weatherData?.current && (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-white/60 text-sm">Humidity</div>
                  <div className="text-white font-bold text-lg">{weatherData.current.humidity}%</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-white/60 text-sm">Wind</div>
                  <div className="text-white font-bold text-lg">{Math.round(weatherData.current.windSpeed)} mph</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Exit button */}
      <button
        onClick={() => window.dispatchEvent(new CustomEvent('close-presenter'))}
        className="absolute top-4 right-4 p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/20 transition-all duration-200"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="bg-black/20 backdrop-blur-sm rounded-lg px-4 py-2 text-center">
          <div className="text-white/60 text-sm">
            Rotate to portrait mode to return to map view
          </div>
        </div>
      </div>

      {/* Development notice */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 left-4">
          <div className="bg-yellow-500/90 rounded px-3 py-1 text-black text-xs font-medium">
            PRESENTER DEV MODE
          </div>
        </div>
      )}
    </div>
  );
};

export default MobilePresenter;