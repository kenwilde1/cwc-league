'use client';

import Image from 'next/image';
import { calculatePoints } from '../utils/calculate_points';
import { useEffect, useState } from 'react';

import users from '../data/users.json';

export function Table() {
    const [players, setPlayers] = useState<any>([]);
    const [loading, setLoading] = useState(true);
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
            } finally {
                setLoading(false);
            }
        }

        fetchPlayers();
    }, []);

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

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
            </div>
        );
    }

    return (
        <div className="bg-slate py-4 px-6">
            <>
                <div className="space-y-3">
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
                                    <span className="font-mono w-6">{index + 1}</span>
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
                                    <span className="text-md truncate">{player.name}</span>
                                </div>
                                <div className="text-right w-1/3 tabular-nums">{player.points}pts</div>
                            </div>
                        ))}
                </div>
            </>
        </div>
    )
}