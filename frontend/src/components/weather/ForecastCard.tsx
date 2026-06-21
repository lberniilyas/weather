'use client';
import type { ForecastDay } from '@/types';

interface CardProps {
  day: ForecastDay;
  selected?: boolean;
  onSelect?: () => void;
}

function ForecastCard({ day, selected, onSelect }: CardProps) {
  const label = new Date(day.date + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  });
  const icon = `https://openweathermap.org/img/wn/${day.icon}@2x.png`;

  return (
    <button
      onClick={onSelect}
      aria-pressed={selected}
      className={`w-full glass rounded-2xl p-5 flex flex-col items-center gap-3 transition-all group text-left
        ${selected ? 'ring-2 ring-blue-400 bg-blue-500/10' : 'hover:bg-white/10'}`}
    >
      <p className={`text-xs font-medium ${selected ? 'text-blue-300' : 'text-slate-400'}`}>{label}</p>
      <img
        src={icon}
        alt={day.condition}
        className="w-14 h-14 drop-shadow group-hover:scale-110 transition-transform"
        loading="lazy"
      />
      <p className="text-slate-300 text-xs capitalize">{day.condition}</p>
      <div className="text-center">
        <p className="text-white font-bold text-lg">{day.maxTemp}°</p>
        <p className="text-slate-500 text-sm">{day.minTemp}°</p>
      </div>
      <div className="w-full grid grid-cols-2 gap-1 text-center text-xs">
        <div className="bg-white/5 rounded-lg py-1.5">
          <p className="text-blue-300 font-medium">{day.humidity}%</p>
          <p className="text-slate-500">Hum.</p>
        </div>
        <div className="bg-white/5 rounded-lg py-1.5">
          <p className="text-blue-300 font-medium">{day.windSpeed.toFixed(1)}</p>
          <p className="text-slate-500">m/s</p>
        </div>
      </div>
    </button>
  );
}

interface GridProps {
  days: ForecastDay[];
  selectedDate?: string | null;
  onSelectDay?: (day: ForecastDay | null) => void;
}

export function ForecastGrid({ days, selectedDate, onSelectDay }: GridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4" role="list" aria-label="5-day weather forecast">
      {days.map((day) => {
        const isSelected = day.date === selectedDate;
        return (
          <div key={day.date} role="listitem">
            <ForecastCard
              day={day}
              selected={isSelected}
              onSelect={() => onSelectDay?.(isSelected ? null : day)}
            />
          </div>
        );
      })}
    </div>
  );
}
