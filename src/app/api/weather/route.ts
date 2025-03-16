import { NextResponse } from 'next/server';

interface ForecastItem {
  dt: number;
  main: {
    temp: number;
  };
  weather: Array<{
    icon: string;
    description: string;
  }>;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const zipCode = searchParams.get('zipCode');
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;

  if (!zipCode) {
    return NextResponse.json({ error: 'ZIP code is required' }, { status: 400 });
  }

  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  try {
    // Fetch current weather
    const currentWeatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode},us&appid=${apiKey}&units=imperial`
    );
    
    // Fetch 5-day forecast
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?zip=${zipCode},us&appid=${apiKey}&units=imperial`
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
        icon: item.weather[0].icon,
        description: item.weather[0].description
      }));

    return NextResponse.json({
      current: currentWeather,
      forecast: dailyForecasts
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: 500 });
  }
} 