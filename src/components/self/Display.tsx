import Progressions from '@components/self/Progressions';
import Miscellaneous from '@components/self/Miscellaneous';
import Graphs from '@components/self/Graphs';
import Achievements from '@components/self/Achievements';
import { Button } from '@mantine/core';
import { toast } from 'react-toastify';

export default function Display() {
  return (
    <div>
      <Progressions/>
      <Miscellaneous/>
      <Graphs/>
      <Achievements/>
      <Button 
      color="gray"
      className="mt-10"
      variant="outline"
      onClick={() => {
        if (localStorage.getItem("statsFile")) {
          localStorage.removeItem("statsFile");
        }
        toast.success("Local cached stats file removed successfully!");
      }}
      >Remove local cached stats file</Button>
    </div>
  );
}