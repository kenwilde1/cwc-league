'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Players() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchPlayers() {
      try {
        const res = await fetch('/api/players');
        
        if (!res.ok) {
          throw new Error('Failed to fetch players');
        }
        
        const data = await res.json();
        setPlayers(data.users);
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
            <h1 className="text-2xl sm:text-2xl md:text-3xl font-bold">Registered Players</h1>
          </div>
          
          <Link
            href="/register"
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded-full transition-colors"
          >
            Register Now
          </Link>
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
            <div>
              <div className="mb-4 text-sm text-gray-400">
                Total registered: {players.length}
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left py-3 px-4">#</th>
                      <th className="text-left py-3 px-4">Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {players.map((player: any, index) => (
                      <tr key={player.id} className="border-b border-gray-800 hover:bg-gray-800">
                        <td className="py-3 px-4">{index + 1}</td>
                        <td className="py-3 px-4">{player.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-yellow-500 hover:text-yellow-400">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
