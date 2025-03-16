'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';

interface WeatherData {
  current: {
    main: {
      temp: number;
      humidity: number;
      temp_min: number;
      temp_max: number;
    };
    weather: Array<{
      description: string;
      icon: string;
    }>;
  };
  forecast: Array<{
    date: string;
    temp: number;
    temp_min: number;
    temp_max: number;
    icon: string;
    description: string;
  }>;
}

interface Location {
  name: string;
  state?: string;
  country: string;
  zip: string;
}

export default function Weather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCelsius, setIsCelsius] = useState(false);
  const [location, setLocation] = useState('95125');
  const [cityName, setCityName] = useState('San Jose');
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const convertTemp = (temp: number) => {
    if (isCelsius) {
      return Math.round((temp - 32) * 5 / 9);
    }
    return Math.round(temp);
  };

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get(`/api/weather?location=${location}`);
        setWeather(response.data);
        setLoading(false);
      } catch {
        setError('Failed to fetch weather data');
        setLoading(false);
      }
    };

    fetchWeather();
  }, [location]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await axios.get(`/api/locations?search=${searchTerm}`);
        setSuggestions(response.data);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Failed to fetch location suggestions:', error);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  if (loading) return <div className="text-gray-700 dark:text-gray-200">Loading weather data...</div>;
  if (error) return <div className="text-red-600 dark:text-red-400">{error}</div>;
  if (!weather) return <div className="text-gray-700 dark:text-gray-200">No weather data available</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Current Weather for {cityName}</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsCelsius(false)}
              className={`px-3 py-1 rounded ${!isCelsius ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
            >
              °F
            </button>
            <button
              onClick={() => setIsCelsius(true)}
              className={`px-3 py-1 rounded ${isCelsius ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
            >
              °C
            </button>
          </div>
        </div>

        <div className="relative mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Enter city or ZIP code"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-300 dark:border-gray-600">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.zip}
                  onClick={() => {
                    setLocation(suggestion.zip);
                    setSearchTerm(suggestion.name);
                    setCityName(suggestion.name);
                    setShowSuggestions(false);
                    setSuggestions([]);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
                >
                  {suggestion.name}{suggestion.state ? `, ${suggestion.state}` : ''}, {suggestion.country}
                </button>
              ))}
            </div>
          )}
        </div>

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
              {convertTemp(weather.current.main.temp)}°{isCelsius ? 'C' : 'F'}
            </p>
            <p className="text-gray-700 dark:text-gray-300 capitalize">
              {weather.current.weather[0].description}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Humidity: {weather.current.main.humidity}%
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              H: {convertTemp(weather.current.main.temp_max)}°{isCelsius ? 'C' : 'F'} 
              L: {convertTemp(weather.current.main.temp_min)}°{isCelsius ? 'C' : 'F'}
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
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {convertTemp(day.temp)}°{isCelsius ? 'C' : 'F'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                H: {convertTemp(day.temp_max)}°{isCelsius ? 'C' : 'F'}
                <br />
                L: {convertTemp(day.temp_min)}°{isCelsius ? 'C' : 'F'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 