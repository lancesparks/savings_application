import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Component, inject, input, OnInit } from '@angular/core';
import { Chart } from 'chart.js';

import { toSignal } from '@angular/core/rxjs-interop';
import { ChartModule } from 'primeng/chart';
import { GoalService } from '../../../services/goal-service';
import { PlatformService } from '../../../services/platform-service';
import { take } from 'rxjs';

Chart.register(ChartDataLabels);

@Component({
  selector: 'app-bar-chart',
  imports: [ChartModule],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.css',
})
export class BarChartComponent implements OnInit {
  private gs = inject(GoalService);
  private ps = inject(PlatformService);
  basicOptions: any = null;
  barChartData = input<any>();
  barChartOptions = input<any>();

  ngOnInit(): void {
    this.basicOptions = {
      maintainAspectRatio: false,
      aspectRatio: 1,
      plugins: {
        legend: { display: false },
        datalabels: {
          anchor: 'start',
          align: 'end',
          display: 'auto',

          color: '#ffffff',
          formatter: (value: number) => '$' + value.toLocaleString('en-US'),
        },
      },
      scales: {
        x: {
          ticks: { color: '#ffffff' },
          grid: { display: false },
        },
        y: {
          beginAtZero: true,
          ticks: { color: '#ffffff' },
        },
      },
    };
  }
}
