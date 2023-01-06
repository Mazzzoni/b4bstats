import { Tooltip } from "@mantine/core";
import React from "react";
import { ChevronsUp } from "react-feather";

type Props = {
  tooltipLabel: React.ReactNode;
  icon: string;
  value: number;
  upgrade?: boolean;
  fractionDigits?: number;
};

export default function IndividualStatistic(statistic: Props) {
  if (typeof statistic.value === 'undefined') {
    console.warn({
      statistic: statistic,
      warning: "Individual statistic not found, need fix !",
    });

    return null;
  }

  const fractionDigits = statistic.fractionDigits !== undefined ? statistic.fractionDigits : 2;

  return (
    <Tooltip
      withArrow
      wrapLines
      label={statistic.tooltipLabel}
      width={280}
      className="col-span-3 bg-gray-100/5 hover:bg-gray-100/10 relative"
    >
      <div className="flex items-center justify-center h-8">
        <div className="bg-center bg-contain bg-no-repeat h-6 w-6 inline-block" style={{backgroundImage: `url(/images/icons/${statistic.icon})`}}/>
        <span className="ml-2 font-bold">{statistic.value.toFixed(fractionDigits)}</span>
      </div>

      {statistic.upgrade && (
        <ChevronsUp size={16} className="color-primary absolute top-0 right-0"/>
      )}
    </Tooltip>
  );
}