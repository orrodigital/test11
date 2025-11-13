# 🌤️ Fullscreen Weather App with AI Presenter

A modern, immersive weather application featuring fullscreen satellite maps, swipeable weather layers, and female AI presenter integration for mobile landscape mode.

## 🚀 Features

### 🗺️ **Fullscreen Map Experience**
- **Complete satellite coverage** with high-resolution imagery
- **Interactive weather layers**: Satellite, Precipitation, 7-Day Forecast
- **Swipe gestures** on mobile to change layers
- **Dark theme** optimized for immersive viewing

### 📱 **Mobile-First Design**
- **Portrait Mode**: Full map with swipe controls
- **Landscape Mode**: Female presenter appears automatically
- **Touch-optimized** interactions
- **Responsive** design for all screen sizes

### 👩‍💼 **AI Presenter Integration**
- **Female presenter** appears in mobile landscape mode
- **Weather-responsive animations**:
  - Hot weather gestures (80°F+)
  - Cold weather animations (40°F-)
  - Rain pointing gestures
  - Sunny welcome animations
- **Interactive controls**: Play/pause, mute, animation selection
- **Dynamic weather scripts** based on conditions

### 🌧️ **Weather Layers**
1. **🛰️ Satellite View** - Default high-res satellite imagery
2. **🌧️ Precipitation** - Live rainfall with visual effects
3. **📅 7-Day Forecast** - Interactive forecast overlay

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- OpenWeatherMap API key (free at [openweathermap.org](https://openweathermap.org/api))

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

3. **Setup environment**
   ```bash
   cp server/.env.example server/.env
   # Edit server/.env and add your OpenWeatherMap API key
   ```

4. **Start the app**
   ```bash
   # Terminal 1 (Backend)
   cd server && npm run dev
   
   # Terminal 2 (Frontend)
   npm start
   ```

5. **Open your browser**
   - App: http://localhost:3000
   - API: http://localhost:3001

## 🎮 How to Use

### **Desktop/Tablet**:
- Click anywhere on map to get weather
- Use layer selector (bottom-left) to switch views
- Click ZIP button (top-right) for location search

### **Mobile Portrait**:
- **Swipe left/right** to change layers: Satellite → Rain → Forecast
- **Tap map** to get weather for any location
- **Layer dots** show current view

### **Mobile Landscape**:
- **Female presenter appears** automatically
- **Weather panel** shows current conditions
- **Interactive presenter controls**
- **Rotate back to portrait** to return to map

## 🔧 Configuration

### API Setup
1. Get free API key from [OpenWeatherMap](https://openweathermap.org/api)
2. Create `server/.env`:
   ```env
   NODE_ENV=development
   PORT=3001
   OPENWEATHER_API_KEY=your_api_key_here
   ```

### Layer Customization
Edit `src/components/WeatherLayers.js` to add more layers or modify existing ones.

### Presenter Customization
Modify `src/components/MobilePresenter.js` to customize presenter appearance and animations.

## 📱 Mobile Features

### Portrait Mode
- **Fullscreen map** with weather overlays
- **Swipe gestures** for layer navigation
- **ZIP code search** via top-right button
- **Current weather** display in top-left

### Landscape Mode
- **Female presenter** takes full screen
- **Weather information panel**
- **Presenter animations** based on weather
- **Interactive playback controls**

## 🎨 Visual Design

### Dark Theme
- **Immersive fullscreen** experience
- **Glassmorphism effects** for overlays
- **Smooth animations** and transitions
- **High contrast** for readability

### Weather Layers
- **Satellite**: High-resolution Earth imagery
- **Rain**: Animated precipitation effects
- **Forecast**: Interactive 7-day cards

## 📂 Project Structure

```
weather-app/
├── src/
│   ├── components/
│   │   ├── FullscreenWeatherMap.js    # Main map component
│   │   ├── ZipCodeModal.js            # Location search
│   │   ├── WeatherLayers.js           # Layer management
│   │   ├── MobilePresenter.js         # Female presenter
│   │   └── ErrorBoundary.js           # Error handling
│   ├── services/
│   │   └── weatherService.js          # API integration
│   ├── hooks/
│   │   └── useSwipeGesture.js         # Touch gestures
│   └── App.js                         # Main app
├── server/                            # Backend API
└── public/                            # Static assets
```

## 🌐 API Endpoints

```bash
# Get weather by coordinates
GET /api/weather/coords?lat=40.7128&lon=-74.0060

# Get weather by ZIP code
GET /api/weather/zip?zip=10001

# Health check
GET /api/health
```

## 🔮 Future Enhancements

### Phase 1 (Current)
- ✅ Fullscreen satellite map
- ✅ Swipeable weather layers
- ✅ Mobile presenter integration
- ✅ Weather-responsive animations

### Phase 2 (Planned)
- 🔄 AI video integration
- 🔄 Voice synthesis
- 🔄 Real-time weather alerts
- 🔄 Advanced gesture controls

### Phase 3 (Future)
- 📅 Unreal Engine 5 integration
- 📅 MetaHuman presenter
- 📅 AR weather visualization
- 📅 Multi-language support

## 🐛 Troubleshooting

### Common Issues

**Map not loading**:
- Check internet connection
- Verify API key in `server/.env`
- Check browser console for errors

**Swipe not working**:
- Ensure you're on mobile device
- Try refreshing the page
- Check touch events in browser dev tools

**Presenter not appearing**:
- Rotate device to landscape
- Check screen size (mobile/tablet only)
- Verify orientation detection

## 📄 License

MIT License - See LICENSE file for details.

## 🙏 Acknowledgments

- OpenWeatherMap for weather data
- Leaflet for mapping
- React team for the framework
- Tailwind CSS for styling

---

**Built for immersive weather experiences! 🌤️**