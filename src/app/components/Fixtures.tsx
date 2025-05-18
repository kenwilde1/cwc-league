import Image from 'next/image';
import fixtures from '../data/fixtures.json';
import logosMap from '../data/logos';

function formatLocalTime(utcString: string) {
  const localDate = new Date(utcString);
  return localDate.toLocaleString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

function getLocalTime(utcString: string) {
  const localDate = new Date(utcString);
  return localDate.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function Fixtures() {
  return (
    <div className="w-full overflow-x-auto py-4 custom-scrollbar">
      <div className="flex gap-4 min-w-max scroll-smooth">
        {fixtures.map((fixture: any) => {
          const homeCrest = (logosMap as any)[fixture.home_team_short];
          const awayCrest = (logosMap as any)[fixture.away_team_short];

          return (
            <div
              key={fixture.match_id}
              className="w-[225px] h-[100px] bg-slate p-3 flex flex-col justify-center shadow-md hover:shadow-lg transition-shadow duration-300 text-xs"
            >
              <div className="flex items-center justify-center gap-2 text-white text-center text-sm">
                <div className="flex items-center gap-2">
                  <span>{fixture.home_team_short}</span>
                  {homeCrest && (
                    <Image
                    src={`/club_crests/${homeCrest}`}
                    alt={fixture.home_team}
                    width={24}
                    height={24}
                    style={{ width: '24px', height: '24px', objectFit: 'contain' }}
                  />
                  )}
                </div>
                <span className="text-white text-lg self-center mx-1">{getLocalTime(fixture.kick_off_at)}</span>
                <div className="flex items-center gap-2">
                  {awayCrest && (
                    <Image
                    src={`/club_crests/${awayCrest}`}
                    alt={fixture.away_team}
                    width={24}
                    height={24}
                    style={{ width: '24px', height: '24px', objectFit: 'contain' }}
                    />
                  )}
                  <span>{fixture.away_team_short}</span>
                </div>
              </div>
              <div className="text-xs text-gray-400 text-center mt-2">
                {formatLocalTime(fixture.kick_off_at)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
