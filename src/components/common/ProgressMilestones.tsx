import { localeFormat } from '@utils/generic';
import React from 'react';
import { CheckSquare } from 'react-feather';

type Props = {
  title: string
  maxValue: number
  currentValue: number
  milestones?: {
    step: number
  }[]
};

const getPercent = (currentValue: number, maxValue: number) => Math.round(currentValue / maxValue * 100);

export default function ProgressMilestones({title, maxValue, currentValue, milestones = []}: Props) {
  const overallPercent = getPercent(currentValue, maxValue);
  const isComplete = currentValue >= maxValue;

  return (
    <div>
      <strong className={`flex ${isComplete ? 'color-success' : ''}`}>
        {isComplete && <CheckSquare size={16} className="relative top-[2px] mr-1"/>} {title}
      </strong>

      <div className="h-5 relative w-full mt-2" style={{backgroundColor: 'var(--secondary-bg-color)'}}>
        <div className="absolute top-0 left-0 right-0 bottom-0 h-5 z-[5] max-w-full" style={{backgroundColor: 'var(--primary-color)', width: `${overallPercent}%`}}/>

        <div className="absolute top-[1-px] left-0 z-10 text-sm px-2 flex justify-between w-full">
          <span>{localeFormat(currentValue)} / {localeFormat(maxValue)}</span>

          <span>({localeFormat(overallPercent)}%)</span>
        </div>

        {milestones.map((milestone) => (
          <span
            key={milestone.step}
            className={`absolute bottom-[-23px] text-xs before:w-px before:h-[26px] before:block before:absolute before:top-[-30px] before:z-[6] before:bg-white/30 ${currentValue > milestone.step ? 'color-success' : ''}`}
            style={{left: `${getPercent(milestone.step, maxValue)}%`}}
          >
            {milestone.step}
          </span>
        ))}
      </div>
    </div>
  );
}