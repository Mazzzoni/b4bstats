import Progressions from './Progressions';
import Miscellaneous from './Miscellaneous';
import Graphs from './Graphs';
import Achievements from './Achievements';
import type { DifficultyFilters } from './DifficultyFiltersState';
export default function Display({
  view = 'all',
  difficultyFilters,
}: {
  view?: 'all' | 'statistics' | 'progression';
  difficultyFilters?: Partial<DifficultyFilters>;
}) {
  return (
    <div className="analyzer-sections">
      {view !== 'statistics' && (
        <section>
          <Progressions difficultyFilters={difficultyFilters} />
        </section>
      )}
      {view !== 'progression' && (
        <>
          <section>
            <Miscellaneous />
          </section>
          <section>
            <Graphs />
          </section>
        </>
      )}
      {view !== 'statistics' && (
        <section>
          <Achievements />
        </section>
      )}
    </div>
  );
}
