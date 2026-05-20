import { Component, computed, effect, input } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Deposit, Goal } from '../../../types';

@Component({
  selector: 'app-goal-card',
  imports: [DecimalPipe, DatePipe],
  templateUrl: './goal-card.component.html',
  styleUrl: './goal-card.component.css',
})
export class GoalCardComponent {
  goal = input.required<Goal>();
  featured = input<boolean>(true); // orange background variant
  completed = input<boolean>(false); // green progress + COMPLETE badge

  totalDeposits = computed(() =>
    this.goal().deposits?.reduce((sum: number, deposit: Deposit) => sum + +deposit.amount, 0),
  );

  constructor() {
    effect(() => {});
  }
}
