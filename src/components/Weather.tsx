'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';

interface WeatherData {
  current: {
    main: {
      temp: number;
      humidity: number;
    };
    weather: Array<{
      description: string;
      icon: string;
    }>;
  };
  forecast: Array<{
    date: string;
    temp: number;
    icon: string;
    description: string;
  }>;
}

export default function Weather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const ZIP_CODE = '95125';

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get(`/api/weather?zipCode=${ZIP_CODE}`);
        setWeather(response.data);
        setLoading(false);
      } catch {
        setError('Failed to fetch weather data');
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading) return <div className="text-gray-700 dark:text-gray-200">Loading weather data...</div>;
  if (error) return <div className="text-red-600 dark:text-red-400">{error}</div>;
  if (!weather) return <div className="text-gray-700 dark:text-gray-200">No weather data available</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Current Weather in {ZIP_CODE}</h2>
        <div className="flex items-center space-x-4">
          {weather.current.weather[0].icon && (
            <Image
              src={`http://openweathermap.org/img/w/${weather.current.weather[0].icon}.png`}
              alt={weather.current.weather[0].description}
              width={50}
              height={50}
            />
          )}
          <div>
            <p className="text-xl font-semibold text-gray-900 dark:text-white">
              {Math.round(weather.current.main.temp)}°F
            </p>
            <p className="text-gray-700 dark:text-gray-300 capitalize">
              {weather.current.weather[0].description}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Humidity: {weather.current.main.humidity}%
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">5-Day Forecast</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {weather.forecast.map((day, index) => (
            <div key={index} className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{day.date}</p>
              {day.icon && (
                <Image
                  src={`http://openweathermap.org/img/w/${day.icon}.png`}
                  alt={day.description}
                  width={40}
                  height={40}
                  className="mx-auto"
                />
              )}
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{day.temp}°F</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 