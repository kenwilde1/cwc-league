export function isMajorTeam(team: string): boolean {
    const majorTeams = [
        'Real Madrid',
        'Bayern Munich',
        'Man City',
        'Chelsea',
        'PSG',
        'Juventus',
        'Inter Milan',
        'Dortmund',
        'Atletico Madrid',
    ];

    return majorTeams.includes(team);
}