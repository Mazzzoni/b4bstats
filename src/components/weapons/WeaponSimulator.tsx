import { Accordion } from '@mantine/core';
import { WeaponDefinition } from '@components/weapons/types';

type Props = {
  weapon: WeaponDefinition;
};

export default function WeaponSimulator({weapon}: Props) {
  return (
    <div className="border-top-subtle">
      <Accordion>
        <Accordion.Item label="Simulator">
          simulator..
        </Accordion.Item>
      </Accordion>
    </div>
  );
}