import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { WeatherApp } from '@/components/WeatherApp';

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0f1e]">
      <Header />
      <main className="flex-1 pt-20">
        <WeatherApp />
      </main>
      <Footer />
    </div>
  );
}
