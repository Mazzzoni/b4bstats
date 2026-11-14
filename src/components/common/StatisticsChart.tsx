import 'chart.js/auto';
import { Chart } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import type { ChartData, ChartOptions, ChartType } from 'chart.js';
import type { ReactNode } from 'react';

/** Shared chart frame for player and community statistics. */
export default function StatisticsChart({
  title,
  type,
  data,
  options,
  height = 320,
  fallbackContent,
  footer,
}: {
  title: string;
  type: ChartType;
  data: ChartData;
  options: ChartOptions;
  height?: number;
  fallbackContent?: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <figure className="min-w-0" aria-label={title}>
      <figcaption className="mb-2 text-sm font-bold">{title}</figcaption>
      <div className="relative min-w-0" style={{ height }}>
        <Chart
          type={type}
          data={data}
          options={{ ...options, color: '#fff', responsive: true, maintainAspectRatio: false }}
          plugins={[ChartDataLabels]}
          role="img"
          aria-label={title}
          fallbackContent={fallbackContent}
        />
      </div>
      {footer && <div className="mt-3">{footer}</div>}
    </figure>
  );
}
