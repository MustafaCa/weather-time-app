# Weather & Time Dashboard

A simple weather and time dashboard built with Next.js, TypeScript, and Tailwind CSS.

## Features

- Current weather display
- 5-day weather forecast
- Real-time clock
- Dark mode support
- Responsive design

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- OpenWeatherMap API

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/weather-time-app.git
cd weather-time-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Create a `.env` file in the root directory and add your OpenWeatherMap API key:
```
OPENWEATHERMAP_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

- `OPENWEATHERMAP_API_KEY`: Your OpenWeatherMap API key (required)

## Deployment

This project is configured for deployment on Vercel. Simply connect your GitHub repository to Vercel and it will automatically deploy your application.

## License

MIT
