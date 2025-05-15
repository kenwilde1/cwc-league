'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { calculatePoints } from './utils/calculate_points';

export default function Players() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [results, setResults] = useState<any>([]);

  useEffect(() => {
    async function fetchPlayers() {
      try {
        const [resultsRes, playersRes] = await Promise.all([
          fetch('/api/results'),
          fetch('/api/players'),
        ]);

        const { results } = await resultsRes.json();
        const filteredResults = results.filter((result: any) => result.started);
        
        const res = await fetch('/api/players');
        
        if (!res.ok) {
          throw new Error('Failed to fetch players');
        }
        
        const data = await res.json();
        setPlayers(data.users);
        setResults(filteredResults);
      } catch (err) {
        console.error('Error fetching players:', err);
        setError('Failed to load registered players. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchPlayers();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12">
          <div className="flex items-center mb-4 md:mb-0">
            <Link href="/">
              <Image
                src="/main.png"
                alt="Club World Cup Predictor Logo"
                width={60}
                height={60}
                className="rounded-full mr-4"
              />
            </Link>
            <h1 className="text-2xl sm:text-2xl md:text-3xl font-bold">CWC 2025 Match Predictor</h1>
          </div>
          <div className='flex justify-center items-center gap-2 text-sm sm:text-base'>
          Want to get in on the action? {' '}
          <Link
            href="/register"
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded-full transition-colors"
          >
            Register Now
          </Link>
          </div>
        </div>
  
        {/* Content */}
        <div className="bg-gray-900 rounded-lg p-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-800 text-white p-4 rounded-md">
              {error}
            </div>
          ) : players.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl mb-4">No registered players yet.</p>
              <p>Be the first to join the prediction challenge!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Player Rows */}
              {players
                .map((player: any, index) => ({
                  ...player,
                  points: calculatePoints(player.id, results),
                }))
                .sort((a, b) => b.points - a.points)
                .map((player, index, arr) => (
                  <div
                    key={player.id}
                    className={`flex justify-between items-center text-lg sm:text-base px-1 py-3 ${
                      index !== arr.length - 1 ? 'border-b border-gray-700' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4 w-2/3">
                      <span className="text-yellow-500 font-mono w-6">{index + 1}</span>
                      <span className="font-medium truncate">{player.name}</span>
                    </div>
                    <div className="text-right w-1/3 tabular-nums">{player.points}pts</div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
