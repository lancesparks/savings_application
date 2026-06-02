import { Component, computed, effect, input } from '@angular/core';
import { DatePipe, DecimalPipe, NgClass } from '@angular/common';
import { Deposit, Goal } from '../../../types';

@Component({
  selector: 'app-goal-card',
  imports: [DecimalPipe, DatePipe, NgClass],
  templateUrl: './goal-card.component.html',
  styleUrl: './goal-card.component.css',
})
export class GoalCardComponent {
  goal = input.required<Goal>();
  featured = input<boolean>(true); // orange background variant
  detailsView = input<boolean>(false);
  goalCompleted = computed(() => {
    const total = this.totalDeposits() ?? 0;
    return total >= this.goal().target;
  });
  isTall = input<boolean>(false);

  totalDeposits = computed(() =>
    this.goal().deposits?.reduce((sum: number, deposit: Deposit) => sum + +deposit.amount, 0),
  );
}
