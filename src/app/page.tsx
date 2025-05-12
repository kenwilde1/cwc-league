'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Home() {
  const tournamentDate = new Date('2025-06-15T00:00:00Z');
  const [timeLeft, setTimeLeft] = useState<{ days: number, hours: number, minutes: number, seconds: number } | null>(null);

  function getTimeLeft() {
    const now = new Date();
    const difference = tournamentDate.getTime() - now.getTime();

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  useEffect(() => {
    setTimeLeft(getTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Render nothing until client-side JS is ready
  if (timeLeft === null) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="mb-8">
        <Image
          src="/main.png"
          alt="Club World Cup Predictor Logo"
          width={160}
          height={160}
          className="rounded-full"
        />
      </div>

      {/* Main Content */}
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Welcome to the Club World Cup 2025 Predictor
        </h1>

        <p className="text-gray-300 mb-8">
          Here we go again, another predictor. Register to express interest, format and prizes to follow.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <a
            href="/register"
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 px-6 rounded-full transition-colors"
          >
            Register here
          </a>

          <a
            href="/players"
            className="border border-yellow-500 hover:bg-yellow-500 hover:text-black text-yellow-500 font-semibold py-3 px-6 rounded-full transition-colors"
          >
            View registered players
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 text-sm text-gray-600">
        Tournament begins in: {' '}{`${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`}
      </footer>
    </div>
  );
}
