import { useEffect, useMemo, useState } from 'react';
import { FaGears, FaClock } from 'react-icons/fa6';

// Default: tomorrow 11:00 AM IST (+05:30). Override with VITE_MAINTENANCE_END (ISO 8601).
const DEFAULT_END = '2026-07-19T11:00:00+05:30';

const getEndTime = () => {
  const raw = import.meta.env.VITE_MAINTENANCE_END?.trim();
  const parsed = raw ? new Date(raw) : new Date(DEFAULT_END);
  return Number.isNaN(parsed.getTime()) ? new Date(DEFAULT_END) : parsed;
};

const getRemaining = (endTime) => {
  const diff = Math.max(0, endTime.getTime() - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  return {
    isOver: diff === 0,
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
};

const pad = (value) => String(value).padStart(2, '0');

const TimeUnit = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-2xl font-bold tabular-nums text-white shadow-inner sm:h-20 sm:w-20 sm:text-3xl">
      {pad(value)}
    </div>
    <span className="mt-2 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
      {label}
    </span>
  </div>
);

const Maintenance = () => {
  const endTime = useMemo(getEndTime, []);
  const [remaining, setRemaining] = useState(() => getRemaining(endTime));

  useEffect(() => {
    const intervalId = setInterval(() => {
      setRemaining(getRemaining(endTime));
    }, 1000);
    return () => clearInterval(intervalId);
  }, [endTime]);

  const backOnlineLabel = endTime.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <main className="relative flex min-h-full items-center justify-center overflow-hidden bg-slate-50 px-4 py-12">
      <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-amber-200/50 blur-3xl" />
      <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-sky-200/40 blur-3xl" />

      <section className="relative w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-200/60 sm:p-12">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
          <FaGears className="text-3xl" aria-hidden="true" />
        </div>

        <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-amber-700">
          Under maintenance
        </p>
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
          We&apos;ll be back shortly
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-7 text-slate-600">
          The Hostel Management System is currently undergoing scheduled maintenance to
          improve your experience. Thanks for your patience.
        </p>

        {remaining.isOver ? (
          <div className="mt-8 rounded-2xl bg-emerald-50 px-6 py-5 text-emerald-700">
            <p className="font-semibold">Maintenance should be complete.</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 inline-flex rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white transition-colors hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              Reload page
            </button>
          </div>
        ) : (
          <>
            <div className="mt-8 flex items-center justify-center gap-3 sm:gap-4">
              <TimeUnit value={remaining.days} label="Days" />
              <span className="pb-6 text-2xl font-bold text-slate-300">:</span>
              <TimeUnit value={remaining.hours} label="Hours" />
              <span className="pb-6 text-2xl font-bold text-slate-300">:</span>
              <TimeUnit value={remaining.minutes} label="Mins" />
              <span className="pb-6 text-2xl font-bold text-slate-300">:</span>
              <TimeUnit value={remaining.seconds} label="Secs" />
            </div>

            <p className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">
              <FaClock aria-hidden="true" className="text-amber-600" />
              Expected back by {backOnlineLabel} IST
            </p>
          </>
        )}
      </section>
    </main>
  );
};

export default Maintenance;
