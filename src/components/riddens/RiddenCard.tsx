import { RiddenDefinition } from '@components/riddens/RiddenProps';
import { Table } from '@mantine/core';
import RiddenHealth from '@components/riddens/charts/RiddenHealth';

type Props = {
  ridden: RiddenDefinition
}

export default function RiddenCard({ridden}: Props) {
  return (
    <div className="grid grid-cols-12 gap-0 mb-10">
      <div className="col-span-2">
        <img src={`/images/riddens/${ridden.image}`} alt={ridden.name} className="h-64 w-48 object-cover sticky top-[80px]"/>
      </div>

      <div className="col-span-10">
        <Table
          highlightOnHover
          verticalSpacing="sm"
          className="w-100"
        >
          <tbody>
          <tr>
            <td style={{width: 150}} className="color-bg-secondary">Name</td>
            <td className="font-bold">{ridden.name}</td>
          </tr>

          <tr>
            <td className="color-bg-secondary">Health</td>
            <td><RiddenHealth health={ridden.health}/></td>
          </tr>

          {ridden.weakspot_multiplier && (
            <tr>
              <td className="color-bg-secondary">Weakspot Multiplier</td>
              <td>{ridden.weakspot_multiplier}</td>
            </tr>
          )}

          {ridden.stumble && (
            <tr>
              <td className="color-bg-secondary">Stumble</td>
              <td>
                <div>Health: {ridden.stumble.health}</div>

                <div>Recovery: +{ridden.stumble.recovery}/s</div>

                {ridden.stumble.weakspot_multiplier && (
                  <div>
                    {typeof ridden.stumble.weakspot_multiplier === 'object' ? (
                      <div>
                        Weakspot Multiplier: {Object.keys(ridden.stumble.weakspot_multiplier).map((type) => (
                        <span key={type}>
                          {/*// @ts-ignore We use the string key to find back the multiplier, it exists, all good */}
                          <span className="mr-2">{type}: x{ridden.stumble.weakspot_multiplier[type]}</span>
                        </span>
                      ))}
                      </div>
                    ) : (
                      <div>Weakspot Multiplier: x{ridden.stumble.weakspot_multiplier}</div>
                    )}
                  </div>
                )}
              </td>
            </tr>
          )}

          {ridden.weakspot_back && (
            <tr>
              <td className="color-bg-secondary">Weakspot Back</td>
              <td>
                <div>Health: {ridden.weakspot_back.health}</div>
                <div>Weakspot Multiplier: {ridden.weakspot_back.weakspot_multiplier}</div>
                <div>Body Damage: {ridden.weakspot_back.body_damage}</div>
              </td>
            </tr>
          )}

          {ridden.weakspot_chest && (
            <tr>
              <td className="color-bg-secondary">Weakspot Chest</td>
              <td>
                <div>Health: {ridden.weakspot_chest.health}</div>
                <div>Weakspot Multiplier: {ridden.weakspot_chest.weakspot_multiplier}</div>
                <div>Body Damage: {ridden.weakspot_chest.body_damage}</div>
              </td>
            </tr>
          )}

          {ridden.weakspot_legs && (
            <tr>
              <td className="color-bg-secondary">Weakspot Legs</td>
              <td>
                <div>Health: {ridden.weakspot_legs.health}</div>
                <div>Weakspot Multiplier: {ridden.weakspot_legs.weakspot_multiplier}</div>
                <div>Body Damage: {ridden.weakspot_legs.body_damage}</div>
              </td>
            </tr>
          )}

          {ridden.weakspot_head && (
            <tr>
              <td className="color-bg-secondary">Weakspot Head</td>
              <td>
                <div>Health: {ridden.weakspot_head.health}</div>
                <div>Weakspot Multiplier: {ridden.weakspot_head.weakspot_multiplier}</div>
                <div>Body Damage: {ridden.weakspot_head.body_damage}</div>
              </td>
            </tr>
          )}

          {ridden.weakspot_body && (
            <tr>
              <td className="color-bg-secondary">Weakspot Body</td>
              <td>
                <div>Health: {ridden.weakspot_body.health}</div>
                <div>Weakspot Multiplier: {ridden.weakspot_body.weakspot_multiplier}</div>
                <div>Body Damage: {ridden.weakspot_body.body_damage}</div>
              </td>
            </tr>
          )}

          {ridden.note && (
            <tr>
              <td className="color-bg-secondary">Note</td>
              <td>{ridden.note}</td>
            </tr>
          )}
          </tbody>
        </Table>
      </div>
    </div>
  );
}