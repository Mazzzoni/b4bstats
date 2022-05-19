import { Tooltip } from '@mantine/core';
import React from 'react';

type Props = {
  tooltipLabel: React.ReactNode;
  icon: string;
  value: number;
  fractionDigits?: number;
}

export default function IndividualStatistic(statistic: Props) {
  const fractionDigits = statistic.fractionDigits !== undefined ? statistic.fractionDigits : 2;

  return (
    <Tooltip
      withArrow
      wrapLines
      label={statistic.tooltipLabel}
      width={280}
      className="col-span-3 bg-gray-100/5 hover:bg-gray-100/10"
    >
      <div className="flex items-center justify-center h-8">
        <div className="bg-center bg-contain bg-no-repeat h-6 w-6 inline-block" style={{backgroundImage: `url(/images/icons/${statistic.icon})`}}/>
        <span className="ml-2 font-bold">{statistic.value.toFixed(fractionDigits)}</span>
      </div>
    </Tooltip>
  );
}