'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Results() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    const { userId } = useParams();

    useEffect(() => {
        async function fetchResults() {
            try {
                const players = await fetch('/api/players');
                const playersData = await players.json();
                const user = playersData.users?.find((user: any) => user.id === userId);
                setIsAdmin(user?.isAdmin);

                if (!user?.isAdmin) {
                    return;
                }
                const res = await fetch('/api/results');
                if (!res.ok) throw new Error('Failed to fetch results');
                const data = await res.json();
                setResults(data.results);
            } catch (err) {
                console.error('Error fetching results:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchResults();
    }, []);

    const handleInputChange = (index: number, field: 'home_goals' | 'away_goals', value: number) => {
        const updated = [...results] as any;
        updated[index][field] = Number(value);
        if (!updated[index].started) {
            updated[index].started = true;
        }
        setResults(updated);
    };

    const handleSave = async () => {
        try {
            const res = await fetch('/api/results', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ results }),
            });
            if (!res.ok) throw new Error('Failed to update results');
            alert('Results updated successfully!');
        } catch (err) {
            console.error(err);
            alert('Update failed.');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="flex justify-center py-12">
                <h1 className="text-yellow-500 text-2xl">You are not authorized to view this page.</h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white py-12 px-4">
            <div className="max-w-6xl mx-auto bg-zinc-900 rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Match Results</h2>
                    <button
                        onClick={handleSave}
                        className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-2 rounded-full"
                    >
                        Save All
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="text-yellow-500 border-b border-zinc-700">
                                <th className="p-3 text-left">Date</th>
                                <th className="p-3 text-left">Time</th>
                                <th className="p-3 text-left">Home</th>
                                <th className="p-3 text-center">Goals</th>
                                <th className="p-3 text-center">-</th>
                                <th className="p-3 text-center">Goals</th>
                                <th className="p-3 text-left">Away</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((match: any, index: number) => {
                                const date = new Date(match.kick_off_at);
                                return (
                                    <tr key={match.match_id} className="border-b border-zinc-800 hover:bg-zinc-800 transition">
                                        <td className="p-3">{date.toLocaleDateString()}</td>
                                        <td className="p-3">{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                        <td className="p-3 font-semibold">{match.home_team}</td>
                                        <td className="p-3 text-center">
                                            <input
                                                type="number"
                                                min="0"
                                                className="bg-zinc-800 text-white w-12 text-center rounded"
                                                value={match.home_goals}
                                                onChange={(e) =>
                                                    handleInputChange(index, 'home_goals', parseInt(e.target.value) || 0)
                                                }
                                            />
                                        </td>
                                        <td className="p-3 text-center text-zinc-400">vs</td>
                                        <td className="p-3 text-center">
                                            <input
                                                type="number"
                                                min="0"
                                                className="bg-zinc-800 text-white w-12 text-center rounded"
                                                value={match.away_goals}
                                                onChange={(e) =>
                                                    handleInputChange(index, 'away_goals', parseInt(e.target.value) || 0)
                                                }
                                            />
                                        </td>
                                        <td className="p-3 font-semibold">{match.away_team}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
