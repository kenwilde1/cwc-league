'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function RegistrationSuccess() {
  const tournamentDate = new Date('2025-06-15T00:00:00Z');
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  function getTimeLeft() {
    const now = new Date();
    const difference = tournamentDate.getTime() - now.getTime();

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 * 60) % 60),
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

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="mb-8">
        <Image
          src="/main.png"
          alt="Club World Cup Predictor Logo"
          width={120}
          height={120}
          className="rounded-full"
        />
      </div>

      {/* Success Message */}
      <div className="text-center max-w-2xl">
        <div className="mb-6">
          <div className="inline-block p-3 rounded-full bg-green-800 mb-4">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Registration Successful!
        </h1>

        <p className="text-gray-300 mb-8">
          Thank you for registering for the FIFA Club World Cup 2025 Predictor. Details to follow.
        </p>

        <div className="bg-gray-900 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Tournament Countdown</h2>
          <div className="grid grid-cols-4 gap-2">
            <div className="flex flex-col items-center">
              <div className="bg-gray-800 rounded-lg p-3 w-full">
                <span className="block text-2xl font-bold">{timeLeft.days}</span>
              </div>
              <span className="text-sm mt-1">Days</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-gray-800 rounded-lg p-3 w-full">
                <span className="block text-2xl font-bold">{timeLeft.hours}</span>
              </div>
              <span className="text-sm mt-1">Hours</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-gray-800 rounded-lg p-3 w-full">
                <span className="block text-2xl font-bold">{timeLeft.minutes}</span>
              </div>
              <span className="text-sm mt-1">Minutes</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-gray-800 rounded-lg p-3 w-full">
                <span className="block text-2xl font-bold">{timeLeft.seconds}</span>
              </div>
              <span className="text-sm mt-1">Seconds</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 px-6 rounded-full transition-colors"
          >
            ← Back to Home
          </Link>

          <Link
            href="/players"
            className="border border-yellow-500 hover:bg-yellow-500 hover:text-black text-yellow-500 font-semibold py-3 px-6 rounded-full transition-colors"
          >
            View Registered Players
          </Link>
        </div>
      </div>
    </div>
  );
}
