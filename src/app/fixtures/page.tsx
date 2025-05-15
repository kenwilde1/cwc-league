'use client';

import { useEffect, useState } from 'react';

export default function Players() {
    const [fixtures, setFixtures] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchFixtures() {
            try {
                const res = await fetch('/api/fixtures');

                if (!res.ok) {
                    throw new Error('Failed to fetch fixtures');
                }

                const data = await res.json();
                setFixtures(data.fixtures);
            } catch (err) {
                console.error('Error fetching fixtures:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchFixtures();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black text-white py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="p-4">
                    <h2 className="text-xl font-bold mb-4">Club World Cup Fixtures 2025</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto border border-gray-300">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2 text-left">Date (UTC)</th>
                                    <th className="px-4 py-2 text-left">Match</th>
                                    <th className="px-4 py-2 text-left">Match ID</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fixtures.map((fixture: any, index) => (
                                    <tr key={index} className="border-t">
                                        <td className="px-4 py-2">{new Date(fixture.kick_off_at).toUTCString()}</td>
                                        <td className="px-4 py-2">
                                            {fixture.home_team_short} ({fixture.home_team}) vs{" "}
                                            {fixture.away_team_short} ({fixture.away_team})
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
