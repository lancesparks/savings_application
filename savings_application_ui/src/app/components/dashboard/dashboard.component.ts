import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavBarComponent } from '../shared/nav-bar/nav-bar.component';
import { GoalCardComponent } from '../shared/goal-card/goal-card.component';
import { CreateGoalComponent } from '../create-goal/create-goal.component';
import { NoGoalsComponent } from '../no-goals/no-goals.component';
import { ButtonComponent } from '../shared/button/button.component';
import { Goal, GoalForm } from '../../types';
import { GoalService } from '../../services/goal-service';
import { take, tap } from 'rxjs';
import { PlatformService } from '../../services/platform-service';
import { InfoCardComponent } from '../shared/info-card/info-card.component';
import { ModalComponent } from '../shared/modal/modal.component';

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
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  private gs: GoalService = inject(GoalService);
  private ps = inject(PlatformService);
  visible = signal<boolean>(false);
  showModal = signal<boolean>(false);
  modalMessage = signal<string>('');
  goals = toSignal(this.gs.goals$, { initialValue: [] });

  constructor() {
    if (this.ps.isBrowser()) {
      this.gs.getGoals().pipe(take(1)).subscribe();
    }
  }

  openCreateGoal(e: boolean) {
    this.visible.set(e);
  }

  createNewGoal(goal: GoalForm) {
    if (!goal) return;

    const newGoal: Goal = {
      ...goal,
      target: parseFloat(goal.target!) as number,
      initial_amount: !goal.initial_amount ? 0 : parseFloat(goal.initial_amount!),
      deadline: goal.deadline === '' ? null : this.gs.getDateString(goal.deadline as Date),
    };
    this.gs
      .createGoal(newGoal)
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          console.log(data);
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
}
