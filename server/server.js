const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const NodeCache = require('node-cache');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Initialize cache (10 minute TTL)
const cache = new NodeCache({ stdTTL: 600 });

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-weather-app.com'] 
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  }
});
app.use('/api', limiter);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// OpenWeatherMap configuration
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || 'demo_key';
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Transform weather data to standardized format
const transformWeatherData = (currentData, forecastData, location) => {
  const current = {
    temperature: currentData.main.temp,
    feelsLike: currentData.main.feels_like,
    humidity: currentData.main.humidity,
    pressure: currentData.main.pressure,
    windSpeed: currentData.wind?.speed || 0,
    windDirection: currentData.wind?.deg || 0,
    visibility: currentData.visibility ? currentData.visibility / 1609.34 : 10,
    uvIndex: 0,
    condition: currentData.weather[0]?.main?.toLowerCase() || 'clear',
    description: currentData.weather[0]?.description || 'Clear sky',
    icon: currentData.weather[0]?.icon || '01d',
    timestamp: Date.now()
  };

  const hourly = forecastData ? forecastData.list.slice(0, 24).map(item => ({
    time: item.dt * 1000,
    temperature: item.main.temp,
    condition: item.weather[0]?.main?.toLowerCase() || 'clear',
    description: item.weather[0]?.description || 'Clear sky',
    icon: item.weather[0]?.icon || '01d',
    precipitation: item.pop ? item.pop * 100 : 0,
    windSpeed: item.wind?.speed || 0
  })) : [];

  const dailyMap = new Map();
  if (forecastData) {
    forecastData.list.forEach(item => {
      const date = new Date(item.dt * 1000).toDateString();
      if (!dailyMap.has(date)) {
        dailyMap.set(date, {
          date: item.dt * 1000,
          temperatureMin: item.main.temp,
          temperatureMax: item.main.temp,
          condition: item.weather[0]?.main?.toLowerCase() || 'clear',
          description: item.weather[0]?.description || 'Clear sky',
          icon: item.weather[0]?.icon || '01d',
          precipitation: item.pop ? item.pop * 100 : 0,
          humidity: item.main.humidity,
          windSpeed: item.wind?.speed || 0
        });
      } else {
        const day = dailyMap.get(date);
        day.temperatureMin = Math.min(day.temperatureMin, item.main.temp);
        day.temperatureMax = Math.max(day.temperatureMax, item.main.temp);
        day.precipitation = Math.max(day.precipitation, item.pop ? item.pop * 100 : 0);
      }
    });
  }

  return {
    location: {
      name: location.name || 'Unknown Location',
      lat: location.lat,
      lon: location.lon,
      country: location.country || '',
      timezone: location.timezone || 0
    },
    current,
    hourly,
    daily: Array.from(dailyMap.values()).slice(0, 7)
  };
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Get weather by coordinates
app.get('/api/weather/coords', async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ 
        error: 'Latitude and longitude are required' 
      });
    }

    // Check cache
    const cacheKey = `weather_${parseFloat(lat).toFixed(2)}_${parseFloat(lon).toFixed(2)}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      return res.json(cachedData);
    }

    // Fetch current weather and forecast
    const [currentResponse, forecastResponse] = await Promise.all([
      axios.get(`${OPENWEATHER_BASE_URL}/weather`, {
        params: {
          lat: parseFloat(lat),
          lon: parseFloat(lon),
          appid: OPENWEATHER_API_KEY,
          units: 'imperial'
        }
      }),
      axios.get(`${OPENWEATHER_BASE_URL}/forecast`, {
        params: {
          lat: parseFloat(lat),
          lon: parseFloat(lon),
          appid: OPENWEATHER_API_KEY,
          units: 'imperial'
        }
      })
    ]);

    const weatherData = transformWeatherData(
      currentResponse.data,
      forecastResponse.data,
      {
        name: currentResponse.data.name,
        lat: parseFloat(lat),
        lon: parseFloat(lon),
        country: currentResponse.data.sys?.country,
        timezone: currentResponse.data.timezone
      }
    );

    // Cache the result
    cache.set(cacheKey, weatherData);

    res.json(weatherData);

  } catch (error) {
    console.error('Weather API error:', error.message);
    
    if (error.response?.status === 401) {
      return res.status(401).json({ 
        error: 'Invalid API key. Please check your OpenWeatherMap configuration.' 
      });
    }
    
    if (error.response?.status === 404) {
      return res.status(404).json({ 
        error: 'Location not found. Please check coordinates.' 
      });
    }

    res.status(500).json({ 
      error: 'Unable to fetch weather data. Please try again later.'
    });
  }
});

// Get weather by ZIP code
app.get('/api/weather/zip', async (req, res) => {
  try {
    const { zip } = req.query;

    if (!zip) {
      return res.status(400).json({ 
        error: 'ZIP code is required' 
      });
    }

    // Validate ZIP code
    const zipRegex = /^\d{5}(-\d{4})?$/;
    if (!zipRegex.test(zip)) {
      return res.status(400).json({ 
        error: 'Invalid ZIP code format' 
      });
    }

    // Check cache
    const cacheKey = `weather_zip_${zip}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      return res.json(cachedData);
    }

    // Get coordinates from ZIP
    const geocodeResponse = await axios.get(`${OPENWEATHER_BASE_URL}/weather`, {
      params: {
        zip: `${zip},US`,
        appid: OPENWEATHER_API_KEY,
        units: 'imperial'
      }
    });

    const { lat, lon } = geocodeResponse.data.coord;

    // Fetch forecast
    const forecastResponse = await axios.get(`${OPENWEATHER_BASE_URL}/forecast`, {
      params: {
        lat,
        lon,
        appid: OPENWEATHER_API_KEY,
        units: 'imperial'
      }
    });

    const weatherData = transformWeatherData(
      geocodeResponse.data,
      forecastResponse.data,
      {
        name: geocodeResponse.data.name,
        lat,
        lon,
        country: geocodeResponse.data.sys?.country || 'US',
        timezone: geocodeResponse.data.timezone
      }
    );

    // Cache the result
    cache.set(cacheKey, weatherData);

    res.json(weatherData);

  } catch (error) {
    console.error('Weather ZIP API error:', error.message);
    
    if (error.response?.status === 404) {
      return res.status(404).json({ 
        error: 'ZIP code not found. Please check your ZIP code.' 
      });
    }

    res.status(500).json({ 
      error: 'Unable to fetch weather data. Please try again later.'
    });
  }
});

// API documentation
app.get('/api/weather', (req, res) => {
  res.json({
    message: 'Fullscreen Weather API v1.0',
    endpoints: {
      'GET /api/weather/coords': 'Get weather by coordinates (lat, lon)',
      'GET /api/weather/zip': 'Get weather by ZIP code',
      'GET /api/health': 'Health check'
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(port, () => {
  console.log(`🌤️  Weather API server running on port ${port}`);
  console.log(`📡 Health check: http://localhost:${port}/api/health`);
  console.log(`🗺️  Weather API: http://localhost:${port}/api/weather`);
  
  if (!process.env.OPENWEATHER_API_KEY || process.env.OPENWEATHER_API_KEY === 'demo_key') {
    console.log('⚠️  Warning: Please set OPENWEATHER_API_KEY in server/.env file');
  }
});