import { Chart as ChartJS } from 'chart.js';

interface Chart extends ChartJS
{
  crosshair: {
    x: number
    y: number
    draw?: boolean
  };
}

export type CrosshairOptions = {
  horizontal: boolean
  vertical: boolean
  color: string
  dash: number[]
  width: number
}

export const ChartPluginCrosshair = {
  id: 'crosshair',

  afterInit: (chart: Chart) => {
    chart.crosshair = {
      x: 0,
      y: 0,
    };
  },

  afterEvent: (chart: Chart, evt: any) => {
    const {
      chartArea: {
        top,
        bottom,
        left,
        right,
      },
    } = chart;

    const {x, y} = evt.event;

    if (x < left || x > right || y < top || y > bottom) {
      chart.crosshair = {
        x,
        y,
        draw: false,
      };
      chart.draw();

      return;
    }

    chart.crosshair = {
      x,
      y,
      draw: true,
    };

    chart.draw();
  },

  afterDatasetsDraw: (chart: Chart, _: any, opts: CrosshairOptions) => {
    const {
      ctx,
      chartArea: {
        top,
        bottom,
        left,
        right,
      },
    } = chart;

    if (!chart.crosshair?.draw) {
      return;
    }

    ctx.lineWidth = opts.width || 0;
    ctx.setLineDash(opts.dash || []);
    ctx.strokeStyle = opts.color || 'black';

    ctx.save();
    ctx.beginPath();

    if (opts.vertical) {
      ctx.moveTo(chart.crosshair.x, bottom);
      ctx.lineTo(chart.crosshair.x, top);
    }

    if (opts.horizontal) {
      ctx.moveTo(left, chart.crosshair.y);
      ctx.lineTo(right, chart.crosshair.y);
    }

    ctx.stroke();
    ctx.restore();
  },
};