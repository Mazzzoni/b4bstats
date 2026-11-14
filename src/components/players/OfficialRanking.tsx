import Link from 'next/link';
import { useUI } from '@translations/useUI';
import { number, playerHref } from '@utils/playerApi';
import { PlayerAvatar, RankNumber } from './Common';

interface OfficialEntry {
  gamertag: string;
  avatar?: string;
  score: number;
  rank: number;
}
interface CombinedBoard {
  leaders: OfficialEntry[];
  currentPage: number;
  hasMore: boolean;
}
export interface CombinedBoardResponse {
  data: CombinedBoard | null;
}

export default function OfficialRanking({ board }: { board: CombinedBoard }) {
  const tr = useUI();
  return (
    <div className="players-table-wrap">
      <table className="players-table">
        <thead>
          <tr>
            <th>{tr('Rank')}</th>
            <th>{tr('Cleaner')}</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {board.leaders.map((player) => (
            <tr key={player.gamertag}>
              <td>
                <RankNumber rank={player.rank} />
              </td>
              <td>
                <Link href={playerHref(player.gamertag)} className="players-person">
                  <PlayerAvatar player={player} />
                  <strong>{player.gamertag}</strong>
                </Link>
              </td>
              <td className="players-selected-column">{number(player.score)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {!board.leaders.length && <div className="players-state">No official scores available.</div>}
    </div>
  );
}
