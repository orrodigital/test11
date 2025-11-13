import React, { useState } from 'react';

// Fallback landing page for when Vanta.js fails to load (like on Vercel SSR)
const FallbackLanding = ({ onEnterApp, onZipSubmit }) => {
  const [zipCode, setZipCode] = useState('');

  const handleEnterApp = (zipCodeValue = null) => {
    if (zipCodeValue && onZipSubmit) {
      onZipSubmit(zipCodeValue);
    }
    onEnterApp();
  };

  const handleZipSubmit = (e) => {
    e.preventDefault();
    if (zipCode.trim()) {
      const zipRegex = /^\d{5}(-\d{4})?$/;
      if (zipRegex.test(zipCode.trim())) {
        handleEnterApp(zipCode.trim());
      }
    } else {
      handleEnterApp();
    }
  };

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (onZipSubmit) {
            onZipSubmit(null, latitude, longitude);
          }
          handleEnterApp();
        },
        () => handleEnterApp()
      );
    } else {
      handleEnterApp();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-slate-900 to-black">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(255,255,255,0.05) 0%, transparent 50%),
                           radial-gradient(circle at 50% 50%, rgba(255,255,255,0.02) 0%, transparent 50%)`
        }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="mb-12">
          {/* Main Tagline */}
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-fade-in">
            Weather Like
          </h1>
          <h1 className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-400 bg-clip-text text-transparent animate-fade-in">
            No Other
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/90 mb-4 font-light animate-fade-in">
            Immersive • Interactive • Intelligent
          </p>
          <p className="text-lg md:text-xl text-white/70 mb-12 font-light animate-fade-in">
            Experience weather through satellite imagery, AI presentation, and cinematic design
          </p>
        </div>

        {/* Features Preview */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 animate-fade-in">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
            <div className="text-4xl mb-4">🛰️</div>
            <h3 className="text-xl font-semibold mb-2">Fullscreen Satellite</h3>
            <p className="text-white/80 text-sm">Real-time satellite imagery with interactive weather layers</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
            <div className="text-4xl mb-4">👩‍💼</div>
            <h3 className="text-xl font-semibold mb-2">AI Presenter</h3>
            <p className="text-white/80 text-sm">Female weather presenter with smart animations</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-semibold mb-2">Touch Optimized</h3>
            <p className="text-white/80 text-sm">Swipe gestures and responsive design for all devices</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="animate-fade-in">
          <button
            onClick={handleEnterApp}
            className="group relative overflow-hidden bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 hover:from-blue-600 hover:via-purple-700 hover:to-pink-600 text-white font-bold py-4 px-12 rounded-full text-xl transition-all duration-300 transform hover:scale-105 focus:ring-4 focus:ring-purple-300 shadow-2xl"
          >
            <span className="relative z-10 flex items-center space-x-3">
              <span>Experience Weather AI</span>
              <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
          
          <p className="mt-6 text-white/60 text-sm">
            No signup required • Free to explore • Works on all devices
          </p>
        </div>
      </div>

      {/* Floating Weather Icons */}
      <div className="absolute top-20 left-10 text-4xl animate-pulse opacity-70">☀️</div>
      <div className="absolute top-32 right-20 text-3xl animate-pulse opacity-60">🌧️</div>
      <div className="absolute bottom-40 left-20 text-3xl animate-pulse opacity-50">❄️</div>
      <div className="absolute bottom-60 right-16 text-2xl animate-pulse opacity-40">🌪️</div>
    </div>
  );
};

export default FallbackLanding;