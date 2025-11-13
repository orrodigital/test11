import axios from 'axios';

// Weather service for handling API calls
class WeatherService {
  constructor() {
    // Use environment variable for API URL in production
    this.baseURL = process.env.REACT_APP_API_URL || '/api/weather';
    this.cache = new Map();
    this.cacheTimeout = 10 * 60 * 1000; // 10 minutes
  }

  // Get cache key for location
  getCacheKey(lat, lon) {
    return `${lat.toFixed(2)},${lon.toFixed(2)}`;
  }

  // Check if cache is valid
  isCacheValid(cacheEntry) {
    return Date.now() - cacheEntry.timestamp < this.cacheTimeout;
  }

  // Get weather data from cache or API
  async getWeatherData(lat, lon) {
    const cacheKey = this.getCacheKey(lat, lon);
    const cached = this.cache.get(cacheKey);

    if (cached && this.isCacheValid(cached)) {
      return cached.data;
    }

    try {
      const response = await axios.get(`${this.baseURL}/coords`, {
        params: { lat, lon }
      });

      const weatherData = this.transformWeatherData(response.data);
      
      // Cache the result
      this.cache.set(cacheKey, {
        data: weatherData,
        timestamp: Date.now()
      });

      return weatherData;
    } catch (error) {
      console.error('Weather API error:', error);
      throw new Error(this.getErrorMessage(error));
    }
  }

  // Get weather by coordinates
  async getWeatherByCoords(lat, lon) {
    return this.getWeatherData(lat, lon);
  }

  // Get weather by ZIP code
  async getWeatherByZip(zipCode) {
    try {
      const response = await axios.get(`${this.baseURL}/zip`, {
        params: { zip: zipCode }
      });

      const weatherData = this.transformWeatherData(response.data);
      
      // Cache by coordinates
      const { lat, lon } = weatherData.location;
      const cacheKey = this.getCacheKey(lat, lon);
      this.cache.set(cacheKey, {
        data: weatherData,
        timestamp: Date.now()
      });

      return weatherData;
    } catch (error) {
      console.error('Weather API error:', error);
      throw new Error(this.getErrorMessage(error));
    }
  }

  // Transform raw API data to standardized format
  transformWeatherData(rawData) {
    return {
      location: {
        name: rawData.location?.name || 'Unknown Location',
        lat: rawData.location?.lat || 0,
        lon: rawData.location?.lon || 0,
        country: rawData.location?.country || '',
        timezone: rawData.location?.timezone || 'UTC'
      },
      current: {
        temperature: rawData.current?.temperature || 0,
        feelsLike: rawData.current?.feelsLike || 0,
        humidity: rawData.current?.humidity || 0,
        pressure: rawData.current?.pressure || 0,
        windSpeed: rawData.current?.windSpeed || 0,
        windDirection: rawData.current?.windDirection || 0,
        visibility: rawData.current?.visibility || 0,
        uvIndex: rawData.current?.uvIndex || 0,
        condition: rawData.current?.condition || 'clear',
        description: rawData.current?.description || 'Clear sky',
        icon: rawData.current?.icon || '01d',
        timestamp: rawData.current?.timestamp || Date.now()
      },
      hourly: rawData.hourly?.map(hour => ({
        time: hour.time,
        temperature: hour.temperature,
        condition: hour.condition,
        description: hour.description,
        icon: hour.icon,
        precipitation: hour.precipitation || 0,
        windSpeed: hour.windSpeed || 0
      })) || [],
      daily: rawData.daily?.map(day => ({
        date: day.date,
        temperatureMin: day.temperatureMin,
        temperatureMax: day.temperatureMax,
        condition: day.condition,
        description: day.description,
        icon: day.icon,
        precipitation: day.precipitation || 0,
        humidity: day.humidity || 0,
        windSpeed: day.windSpeed || 0
      })) || []
    };
  }

  // Get user-friendly error message
  getErrorMessage(error) {
    if (error.response) {
      switch (error.response.status) {
        case 404:
          return 'Location not found. Please check your ZIP code.';
        case 429:
          return 'Too many requests. Please wait a moment and try again.';
        case 500:
          return 'Weather service is temporarily unavailable.';
        default:
          return 'Unable to fetch weather data. Please try again.';
      }
    } else if (error.request) {
      return 'No internet connection. Please check your network.';
    } else {
      return 'Something went wrong. Please try again.';
    }
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }
}

export const weatherService = new WeatherService();