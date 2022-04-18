import { RiddenDefinition } from '@components/riddens/RiddenProps';
import RiddenCard from '@components/riddens/RiddenCard';

type Props = {
  categoryName: string
  riddens: RiddenDefinition[]
}

export default function RiddensCategory({categoryName, riddens}: Props) {
  if (riddens.length === 0) {
    return null;
  }

  return (
    <div id={categoryName} className="mb-12">
      <h2 className="text-2xl font-bold mb-3 capitalize">{categoryName}</h2>

      {riddens.map((ridden) => (
        <RiddenCard key={ridden.name} ridden={ridden}/>
      ))}
    </div>
  );
}