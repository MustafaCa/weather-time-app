import Clock from '@/components/Clock';
import Weather from '@/components/Weather';

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Weather & Time Dashboard
        </h1>
        <Clock />
        <Weather />
      </div>
    </main>
  );
} 