import { NextResponse } from 'next/server';

interface LocationResponse {
  name: string;
  state?: string;
  country: string;
  lat: number;
  lon: number;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;

  if (!search || !apiKey) {
    return NextResponse.json({ error: 'Search term and API key are required' }, { status: 400 });
  }

  try {
    // Try to fetch by city name first
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${search},US&limit=5&appid=${apiKey}`
    );

    if (!response.ok) {
      throw new Error('Location API request failed');
    }

    const data = await response.json() as LocationResponse[];
    
    // Format the response
    const locations = data.map((item) => ({
      name: item.name,
      state: item.state,
      country: item.country,
      zip: `${item.lat},${item.lon}`
    }));

    return NextResponse.json(locations);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch location suggestions' }, { status: 500 });
  }
} 