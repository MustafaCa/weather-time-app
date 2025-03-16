import { NextResponse } from 'next/server';

interface ForecastItem {
  dt: number;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
  };
  weather: Array<{
    icon: string;
    description: string;
  }>;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get('location');
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;

  if (!location) {
    return NextResponse.json({ error: 'Location is required' }, { status: 400 });
  }

  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  try {
    // Determine if location is a ZIP code or coordinates
    const isCoordinates = location.includes(',');
    const locationParam = isCoordinates ? `lat=${location.split(',')[0]}&lon=${location.split(',')[1]}` : `zip=${location},us`;

    // Fetch current weather
    const currentWeatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?${locationParam}&appid=${apiKey}&units=imperial`
    );
    
    // Fetch 5-day forecast
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?${locationParam}&appid=${apiKey}&units=imperial`
    );

    if (!currentWeatherResponse.ok || !forecastResponse.ok) {
      throw new Error('Weather API request failed');
    }

    const currentWeather = await currentWeatherResponse.json();
    const forecast = await forecastResponse.json();

    // Process forecast data to get daily forecasts
    const dailyForecasts = forecast.list
      .filter((item: ForecastItem, index: number) => index % 8 === 0) // Get one reading per day
      .slice(0, 5) // Get 5 days
      .map((item: ForecastItem) => ({
        date: new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        temp: Math.round(item.main.temp),
        temp_min: Math.round(item.main.temp_min),
        temp_max: Math.round(item.main.temp_max),
        icon: item.weather[0].icon,
        description: item.weather[0].description
      }));

    return NextResponse.json({
      current: {
        main: {
          temp: currentWeather.main.temp,
          humidity: currentWeather.main.humidity,
          temp_min: currentWeather.main.temp_min,
          temp_max: currentWeather.main.temp_max
        },
        weather: currentWeather.weather
      },
      forecast: dailyForecasts
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: 500 });
  }
} 