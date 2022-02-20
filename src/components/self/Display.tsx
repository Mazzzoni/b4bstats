import Progressions from '@components/self/Progressions';
import Miscellaneous from '@components/self/Miscellaneous';
import Graphs from '@components/self/Graphs';
import Achievements from '@components/self/Achievements';

export default function Display() {
  return (
    <div>
      <Progressions/>
      <Miscellaneous/>
      <Graphs/>
      <Achievements/>
    </div>
  );
}