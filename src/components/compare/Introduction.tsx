import React, { ChangeEvent, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import PlayersStatisticsState, { PlayersStatistics } from '@components/compare/PlayersStatisticsState';
import Dropzone from '@components/common/Dropzone';
import Statistics from '@components/statistics/Statistics';
import { Input } from '@mantine/core';

export default function Introduction() {
  const setPlayersStatistics = useSetRecoilState(PlayersStatisticsState);

  const [player0Name, setPlayer0Name] = useState('');
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [player3Name, setPlayer3Name] = useState('');

  const [player0Stats, setPlayer0Stats] = useState<Statistics>(new Statistics());
  const [player1Stats, setPlayer1Stats] = useState<Statistics>(new Statistics());
  const [player2Stats, setPlayer2Stats] = useState<Statistics>(new Statistics());
  const [player3Stats, setPlayer3Stats] = useState<Statistics>(new Statistics());

  const compare = () => {
    let playersStats: PlayersStatistics[] = [];

    if (player0Name !== '' && player0Stats !== null) {
      playersStats.push({
        player: player0Name,
        stats: player0Stats,
      });
    }

    if (player1Name !== '' && player1Stats !== null) {
      playersStats.push({
        player: player1Name,
        stats: player1Stats,
      });
    }

    if (player2Name !== '' && player2Stats !== null) {
      playersStats.push({
        player: player2Name,
        stats: player2Stats,
      });
    }

    if (player3Name !== '' && player3Stats !== null) {
      playersStats.push({
        player: player3Name,
        stats: player3Stats,
      });
    }

    if (playersStats.length <= 1) {
      alert('Please submit two or more files to compare.');
    }

    setPlayersStatistics(playersStats);
  };

  return (
    <div>
      <p>
        Select multiple statistics files, then click the button below to compare them.
      </p>

      <div className="grid grid-cols-12 gap-6 mt-4">
        <div className="col-span-3">
          <Input
            placeholder="Player name"
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPlayer0Name(e.target.value)}
          />
          {!player0Stats.hydrated ? <Dropzone setStatistics={setPlayer0Stats}/> : <p>Statistics parsed.</p>}
        </div>

        <div className="col-span-3">
          <Input
            placeholder="Player name"
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPlayer1Name(e.target.value)}
          />
          {!player1Stats.hydrated ? <Dropzone setStatistics={setPlayer1Stats}/> : <p>Statistics parsed.</p>}
        </div>

        <div className="col-span-3">
          <Input
            placeholder="Player name"
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPlayer2Name(e.target.value)}
          />
          {!player2Stats.hydrated ? <Dropzone setStatistics={setPlayer2Stats}/> : <p>Statistics parsed.</p>}
        </div>

        <div className="col-span-3">
          <Input
            placeholder="Player name"
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPlayer3Name(e.target.value)}
          />
          {!player3Stats.hydrated ? <Dropzone setStatistics={setPlayer3Stats}/> : <p>Statistics parsed.</p>}
        </div>
      </div>

      <div className="mt-5 text-center">
        <span className="color-primary cursor-pointer" onClick={compare}>{'>> '}Compare{' <<'}</span>
      </div>

      <style jsx>{`
        input {
          border-radius: 0;
        }
      `}</style>
    </div>
  );
}