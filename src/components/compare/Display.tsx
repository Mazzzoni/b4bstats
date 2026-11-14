import Graphs from '@components/compare/Graphs';
import Summary from '@components/compare/Summary';

export default function Display() {
  return (
    <div className="comparison-statistics mt-6 space-y-8">
      <Summary />
      <Graphs />
    </div>
  );
}
