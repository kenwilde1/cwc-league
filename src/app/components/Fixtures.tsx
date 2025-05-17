import Image from 'next/image';
import fixtures from '../data/fixtures.json';
import logosMap from '../data/logos';

function formatLocalTime(utcString: string) {
  const localDate = new Date(utcString);
  return localDate.toLocaleString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function Fixtures() {
  return (
    <div className="w-full overflow-x-auto py-4 px-2 custom-scrollbar">
      <div className="flex gap-4 min-w-max scroll-smooth">
        {fixtures.map((fixture: any) => {
          const homeCrest = (logosMap as any)[fixture.home_team];
          const awayCrest = (logosMap as any)[fixture.away_team];

          return (
            <div
              key={fixture.match_id}
              className="w-[170px] h-[140px] bg-neutral-900 border border-yellow-500 rounded-md p-3 flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow duration-300 text-xs"
            >
              <div className="flex flex-col items-start pl-2 gap-2 text-white font-semibold text-center text-sm">
                <div className="flex items-center gap-2">
                  {homeCrest && (
                    <Image
                    src={`/club_crests/${homeCrest}`}
                    alt={fixture.home_team}
                    width={24}
                    height={24}
                    style={{ width: '24px', height: '24px', objectFit: 'contain' }}
                  />
                  )}
                  <span>{fixture.home_team}</span>
                </div>
                <span className="text-gray-400 text-xs self-center">vs</span>
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
                  <span>{fixture.away_team}</span>
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
