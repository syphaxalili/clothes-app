const axios = require('axios');

class WeatherService {
  async getWeather(latitude, longitude) {
    try {
      const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
        params: {
          latitude,
          longitude,
          current: 'temperature_2m,precipitation,rain',
          timezone: 'auto'
        }
      });

      const { current } = response.data;
      
      return {
        temperature: current.temperature_2m,
        isRaining: current.rain > 0 || current.precipitation > 0
      };
    } catch (error) {
      console.error('Weather API error:', error.message);
      throw new Error('Failed to fetch weather data');
    }
  }
}

module.exports = new WeatherService();
