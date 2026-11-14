import { useState } from 'react';
import { useSetAtom } from 'jotai';
import { Button, TextInput, Badge } from '@mantine/core';
import { Check, Upload } from 'react-feather';
import PlayersStatisticsState from './PlayersStatisticsState';
import Dropzone from '@components/common/Dropzone';
import Statistics from '@components/statistics/Statistics';
export default function Introduction() {
  const setPlayers = useSetAtom(PlayersStatisticsState);
  const [slots, setSlots] = useState<{ name: string; stats: Statistics | null }[]>(() =>
    Array.from({ length: 4 }, () => ({ name: '', stats: null })),
  );
  const ready = slots.filter((slot) => slot.stats?.hydrated);
  function update(index: number, values: Partial<(typeof slots)[number]>) {
    setSlots((current) => current.map((slot, i) => (i === index ? { ...slot, ...values } : slot)));
  }
  return (
    <section className="players-panel p-5 sm:p-7">
      <div className="mb-5 flex items-center gap-3">
        <Upload size={20} className="text-brand" />
        <p className="text-muted">Choose two to four save files to compare.</p>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {slots.map((slot, index) => (
          <div className="min-w-0 rounded border border-line bg-background p-5" key={index}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="!mb-0 !text-base">Player {index + 1}</h2>
              {slot.stats?.hydrated && <Badge leftSection={<Check size={12} />}>Ready</Badge>}
            </div>
            <TextInput
              label="Player name"
              placeholder={'Player ' + (index + 1)}
              value={slot.name}
              onChange={(event) => update(index, { name: event.target.value })}
            />
            {slot.stats?.hydrated ? (
              <div className="mt-5 flex items-center justify-between gap-3 text-sm">
                <span className="text-muted">Save loaded</span>
                <Button size="xs" variant="subtle" onClick={() => update(index, { stats: null })}>
                  Replace file
                </Button>
              </div>
            ) : (
              <Dropzone persist={false} setStatistics={(stats) => update(index, { stats })} />
            )}
          </div>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Button
          disabled={ready.length < 2}
          onClick={() =>
            setPlayers(
              slots.flatMap((slot, index) =>
                slot.stats?.hydrated
                  ? [{ player: slot.name.trim() || 'Player ' + (index + 1), stats: slot.stats }]
                  : [],
              ),
            )
          }
        >
          Compare {ready.length} saves →
        </Button>
        <span className="text-xs text-muted">{ready.length}/4 loaded</span>
      </div>
    </section>
  );
}
