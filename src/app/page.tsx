'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { calculatePoints } from './utils/calculate_points';

import { Fixtures } from './components/Fixtures';

import users from './data/users.json';

export default function Players() {
  const [players, setPlayers] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [results, setResults] = useState<any>([]);
  const [profilePics, setProfilePics] = useState<{ [userId: string]: string }>({});

  useEffect(() => {
    async function fetchPlayers() {
      try {
        const resultsRes = await fetch('/api/results')
        const { results } = await resultsRes.json();
        const filteredResults = results.filter((result: any) => result.started);

        setPlayers(users);
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

  // Fetch profile pictures for all players after players are loaded
  useEffect(() => {
    async function fetchProfilePics() {
      if (!players || players.length === 0) return;
      const picEntries = await Promise.all(
        players.map(async (player: any) => {
          try {
            const res = await fetch('/api/list_blobs', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: player.id, type: 'profilePic' }),
            });
            if (res.ok) {
              const data = await res.json();
              if (data && data.url) {
                return [player.id, data.url];
              }
            }
          } catch (e) {
            // Ignore errors for missing profile pics
          }
          return [player.id, ''];
        })
      );
      setProfilePics(Object.fromEntries(picEntries));
    }
    if (players.length > 0) {
      fetchProfilePics();
    }
  }, [players]);

  return (
    <div className="min-h-screen bg-stone-950 text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12">
          <div className="flex mb-4 md:mb-0">
            <Link href="/">
              <Image
                src="/main.png"
                alt="Club World Cup Predictor Logo"
                width={60}
                height={60}
                className="rounded-full mr-4"
              />
            </Link>
            <div className="flex flex-col">
              <h1 className="text-2xl sm:text-2xl md:text-3xl font-bold">CWC 2025</h1>
              <h1 className="text-2xl sm:text-2xl md:text-3xl font-bold">Match Predictor</h1>
            </div>

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

        {/* Fixtures */}
        <h2 className='font-bold text-lg'>Group Stage Fixtures</h2>
        <Fixtures />

        <div className='font-bold text-lg py-4'>Latest update: tournament_not_started</div>

        {/* Content */}
        <div className="bg-neutral-900 border border-yellow-500 rounded-md p-6">
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
            <>
            <div className="space-y-3">
              {/* Player Rows */}
              {players
                .map((player: any) => ({
                  ...player,
                  points: calculatePoints(player.id, results),
                }))
                .sort((a: any, b: any) => b.points - a.points)
                .map((player: any, index: any, arr: any) => (
                  <div
                    key={player.id}
                    className={`flex justify-between items-center text-lg sm:text-base px-1 py-3 ${index !== arr.length - 1 ? 'border-b border-gray-700' : ''}`}
                  >
                    <div className="flex items-center gap-4 w-2/3">
                      <span className="text-yellow-500 font-mono w-6">{index + 1}</span>
                      {profilePics[player.id] ? (
                        <Image
                          src={profilePics[player.id]}
                          alt={player.name + " profile pic"}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-full object-cover border border-zinc-700"
                          unoptimized
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-gray-500 text-xl">?</div>
                      )}
                      <span className="font-medium truncate">{player.name}</span>
                    </div>
                    <div className="text-right w-1/3 tabular-nums">{player.points}pts</div>
                  </div>
                ))}
            </div></>
          )}
        </div>
      </div>
    </div>
  );
}
