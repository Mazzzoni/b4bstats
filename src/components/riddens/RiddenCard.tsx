import { RiddenDefinition } from './types';
import RiddenHealth from './charts/RiddenHealth';
export default function RiddenCard({ ridden }: { ridden: RiddenDefinition }) {
  const weakspots = (
    [
      ['Back', ridden.weakspot_back],
      ['Chest', ridden.weakspot_chest],
      ['Legs', ridden.weakspot_legs],
      ['Head', ridden.weakspot_head],
      ['Body', ridden.weakspot_body],
    ] as const
  ).filter(([, zone]) => zone);
  return (
    <article className="mb-6 grid grid-cols-1 gap-6 rounded border border-line bg-panel p-5 sm:p-6 md:grid-cols-12">
      <div className="mx-auto w-full max-w-56 md:col-span-3">
        <div className="sticky top-20">
          <h3 className="mb-3 text-center !text-sm uppercase tracking-wide">{ridden.name}</h3>
          <a href={'/images/riddens/' + ridden.image} target="_blank" rel="noreferrer">
            <img
              src={'/images/riddens/' + ridden.image}
              alt={ridden.name}
              loading="lazy"
              className="w-full rounded border border-line object-cover"
            />
          </a>
        </div>
      </div>
      <div className="min-w-0 space-y-4 md:col-span-9">
        <section className="ridden-detail">
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted">
            Effective health
          </h4>
          <RiddenHealth health={ridden.health} />
        </section>
        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {ridden.weakspot_multiplier != null && (
            <div className="ridden-detail">
              <dt>Weakspot multiplier</dt>
              <dd className="text-xl">×{ridden.weakspot_multiplier}</dd>
            </div>
          )}
          {ridden.stumble && (
            <div className="ridden-detail">
              <dt>Stumble</dt>
              <dd>
                {ridden.stumble.health} health{' '}
                <span className="font-normal text-muted">
                  · +{ridden.stumble.recovery}/s recovery
                </span>
              </dd>
              {ridden.stumble.weakspot_multiplier != null && (
                <div className="mt-2 text-xs text-muted">
                  Weakspot:{' '}
                  {typeof ridden.stumble.weakspot_multiplier === 'object'
                    ? Object.entries(ridden.stumble.weakspot_multiplier)
                        .map(([type, value]) => `${type} ×${value}`)
                        .join(' · ')
                    : '×' + ridden.stumble.weakspot_multiplier}
                </div>
              )}
            </div>
          )}
          {weakspots.map(
            ([name, zone]) =>
              zone && (
                <div key={name} className="ridden-detail">
                  <dt>{name} weakspot</dt>
                  <dd>{zone.health} health</dd>
                  <div className="mt-2 text-xs text-muted">
                    ×{zone.weakspot_multiplier} multiplier · {zone.body_damage} body damage
                  </div>
                </div>
              ),
          )}
        </dl>
        {ridden.note && (
          <p className="rounded border-l-2 border-brand bg-background p-4 text-sm text-muted">
            {ridden.note}
          </p>
        )}
      </div>
    </article>
  );
}
