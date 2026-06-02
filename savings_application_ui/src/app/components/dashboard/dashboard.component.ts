import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavBarComponent } from '../shared/nav-bar/nav-bar.component';
import { GoalCardComponent } from '../shared/goal-card/goal-card.component';
import { CreateGoalComponent } from '../create-goal/create-goal.component';
import { NoGoalsComponent } from '../no-goals/no-goals.component';
import { ButtonComponent } from '../shared/button/button.component';
import { Goal, GoalForm } from '../../types';
import { GoalService } from '../../services/goal-service';
import { map, take } from 'rxjs';
import { PlatformService } from '../../services/platform-service';
import { InfoCardComponent } from '../shared/info-card/info-card.component';
import { ModalComponent } from '../shared/modal/modal.component';
import { BarChartComponent } from '../shared/bar-chart/bar-chart.component';
import { RoutingService } from '../../services/routing-service';
import { PopoverModule } from 'primeng/popover';
import { RadioButtonComponent } from '../shared/radio-button/radio-button.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    NavBarComponent,
    GoalCardComponent,
    InfoCardComponent,
    CreateGoalComponent,
    NoGoalsComponent,
    ButtonComponent,
    ModalComponent,
    BarChartComponent,
    PopoverModule,
    RadioButtonComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  private gs: GoalService = inject(GoalService);
  private ps = inject(PlatformService);
  private rs = inject(RoutingService);
  visible = signal<boolean>(false);
  showModal = signal<boolean>(false);
  modalMessage = signal<string>('');
  goals = toSignal(this.gs.goals$, { initialValue: [] });
  deposits = toSignal(
    this.gs.deposits$.pipe(
      map((data: any[]) => {
        if (!data.length) return null;
        // const barChartData = this.getBarChartData(data);
        return this.formatBarChartData(data);
      }),
    ),
    { initialValue: null },
  );
  totalSavings = computed(() =>
    this.goals()
      .map((goal) => {
        return goal.deposits?.reduce((sum, d) => sum + +d.amount, 0) ?? 0;
      })
      .reduce((sum, d) => sum + +d, 0),
  );
  completedGoals = computed(
    () =>
      this.goals().filter((goal) => {
        const total = goal.deposits?.reduce((sum, d) => sum + +d.amount, 0) ?? 0;
        return total >= goal.target;
      }).length,
  );

  activeFilter = signal<string>('all');
  activeSort = signal<string>('all');

  filteredGoals = computed(() => {
    const filter = this.activeFilter();
    const sort = this.activeSort();
    const goals = [...this.goals()];

    if (filter === 'all' && sort === 'all') return goals;

    if (filter !== 'all' && sort === 'all') {
      return this.handleFilterItems(goals, filter);
    }

    if (filter === 'all' && sort !== 'all') {
      return this.handleSortItems(goals, sort);
    }

    if (filter !== 'all' && sort !== 'all') {
      const filtered = this.handleFilterItems(goals, filter);
      return this.handleSortItems(filtered, sort);
    }

    return goals;
  });

  filterOptions = [
    { label: 'All goals', value: 'all' },
    { label: 'In progress', value: 'in_progress' },
    { label: 'Completed', value: 'completed' },
    { label: 'Not started', value: 'not_started' },
  ];

  sortOptions = [
    { label: 'Recently added', value: 'recent' },
    { label: 'Deadline (soonest first)', value: 'deadline' },
    { label: 'Progress (highest first)', value: 'progress_desc' },
    { label: 'Progress (lowest first)', value: 'progress_asc' },
    { label: 'Amount saved (highest first)', value: 'amount_desc' },
    { label: 'Alphabetical (A–Z)', value: 'alphabetical' },
  ];

  constructor() {
    if (this.ps.isBrowser()) {
      this.gs.getGoals().pipe(take(1)).subscribe();
      this.gs.getDeposits().pipe(take(1)).subscribe();
    }
  }

  openCreateGoal(e: boolean) {
    this.visible.set(e);
  }

  createNewGoal(goal: GoalForm) {
    if (!goal) return;

    const newGoal = {
      ...goal,
      target: parseFloat(goal.target!) as number,
      initial_amount: !goal.initial_amount ? 0 : parseFloat(goal.initial_amount!),
      deadline: goal.deadline === '' ? null : this.gs.getDateString(goal.deadline as Date),
      is_featured: goal.is_featured,
    } as Goal;
    this.gs
      .createGoal(newGoal)
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          this.gs.getDeposits().pipe(take(1)).subscribe();
          this.showModal.set(true);
          this.modalMessage.set('New goal created!');
        },
        error: (e) => {
          this.modalMessage.set(e);
        },
      });
  }

  closeModals() {
    this.visible.set(false);
    this.showModal.set(false);
  }

  formatBarChartData(barChartData: any) {
    let labels: string[] = [];
    let values: number[] = [];

    barChartData.forEach((item: any) => {
      labels.push(
        new Date(`${item.month}-01T00:00:00Z`).toLocaleString('default', {
          month: 'short',
          year: 'numeric',
          timeZone: 'UTC',
        }),
      );

      values.push(item.total);
    });

    return {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: '#f97316',
          borderColor: '#f97316',
          borderRadius: 8,
        },
      ],
    };
  }

  viewGoalDetails(goal: Goal) {
    this.rs.routeToPage(`/details/${goal.id}`);
  }

  filterItems(e: any) {
    this.activeFilter.set(e);
  }

  sortItems(e: any) {
    this.activeSort.set(e);
  }

  handleFilterItems(goals: Goal[], filter: string) {
    return goals.filter((goal) => {
      const total = goal.deposits?.reduce((sum, d) => sum + +d.amount, 0) ?? 0;

      if (filter === 'completed') return total >= goal.target;
      if (filter === 'in_progress') return total > 0 && total < goal.target;
      if (filter === 'not_started') return total === 0;

      return true;
    });
  }

  handleSortItems(goals: Goal[], sort: string) {
    if (sort === 'recent')
      return goals.sort(
        (a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime(),
      );

    if (sort === 'deadline')
      return goals.sort((a, b) => {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      });

    if (sort === 'progress_desc' || sort === 'progress_asc') {
      return goals.sort((a, b) => {
        const aTotal = a.deposits?.reduce((sum, d) => sum + +d.amount, 0) ?? 0;
        const bTotal = b.deposits?.reduce((sum, d) => sum + +d.amount, 0) ?? 0;
        const aProgress = aTotal / a.target;
        const bProgress = bTotal / b.target;
        return sort === 'progress_desc' ? bProgress - aProgress : aProgress - bProgress;
      });
    }

    if (sort === 'amount_desc')
      return goals.sort((a, b) => {
        const aTotal = a.deposits?.reduce((sum, d) => sum + +d.amount, 0) ?? 0;
        const bTotal = b.deposits?.reduce((sum, d) => sum + +d.amount, 0) ?? 0;
        return bTotal - aTotal;
      });

    if (sort === 'alphabetical') return goals.sort((a, b) => a.name.localeCompare(b.name));

    return goals;
  }

  clearFilters() {
    this.activeFilter.set('all');
    this.activeSort.set('all');
  }
}
