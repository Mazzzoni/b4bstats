import { Accordion } from '@mantine/core';
import { WeaponDefinition } from '@components/weapons/types';

type Props = {
  weapon: WeaponDefinition;
};

export default function WeaponSimulator({ weapon }: Props) {
  return (
    <div className="border-top-subtle">
      <Accordion>
        <Accordion.Item value="simulator">
          <Accordion.Control>Simulator</Accordion.Control>
          <Accordion.Panel>simulator..</Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}
