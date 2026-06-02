import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap, take, tap } from 'rxjs';
import { GoalService } from '../../services/goal-service';
import { NavBarComponent } from '../shared/nav-bar/nav-bar.component';
import { CreateGoalComponent } from '../create-goal/create-goal.component';
import { Deposit, Goal, GoalForm } from '../../types';
import { InfoCardComponent } from '../shared/info-card/info-card.component';
import { InputComponent } from '../shared/input/input.component';
import { ButtonComponent } from '../shared/button/button.component';
import { RoutingService } from '../../services/routing-service';
import { EditGoalComponent } from '../edit-goal/edit-goal.component';
import { ModalComponent } from '../shared/modal/modal.component';
import { error } from 'console';
import { DeleteModalComponent } from '../delete-modal/delete-modal.component';

@Component({
  selector: 'app-details',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NavBarComponent,
    CreateGoalComponent,
    InfoCardComponent,
    InputComponent,
    ButtonComponent,
    DecimalPipe,
    CurrencyPipe,
    DatePipe,
    EditGoalComponent,
    ModalComponent,
    DeleteModalComponent,
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent {
  private rs = inject(RoutingService);
  private route = inject(ActivatedRoute);
  private gs = inject(GoalService);
  showCreateGoal = signal<boolean>(false);
  showEditGoal = signal<boolean>(false);
  refresh = signal(0);
  depositError = signal<string | null>(null);
  showModalMessage = signal<string>('null');
  showModal = signal<boolean>(false);
  showDeleteModal = signal<boolean>(false);
  goalDeleted = signal<boolean>(false);

  selectedGoal = toSignal(
    toObservable(this.refresh).pipe(
      switchMap(() => this.route.params),
      map((p) => p['id']),
      switchMap((id) => this.gs.getGoalDetails(id)),
    ),
    { initialValue: null },
  );

  totalDeposits = computed(
    () => this.selectedGoal()?.deposits?.reduce((sum, deposit) => sum + +deposit.amount, 0) ?? 0,
  );

  goalCompleted = computed(() => {
    if (!this.selectedGoal()) {
      return false;
    }
    return this.totalDeposits() >= this.selectedGoal()!.target;
  });

  createDepositForm = new FormGroup({
    amount: new FormControl('', [Validators.required]),
    note: new FormControl('', [Validators.required]),
  });

  createNewGoal(e: any) {}

  validateDeposit() {
    const deposit: any = parseFloat(this.createDepositForm.value.amount ?? '0');

    if (Number.isNaN(deposit)) {
      return;
    }

    if (this.totalDeposits() + deposit > this.selectedGoal()!.target) {
      this.depositError.set('Deposit exceeds target amount');
    }
  }

  addFunds() {
    this.depositError.set(null);
    const goal = this.selectedGoal();
    if (!goal?.id) return;

    this.validateDeposit();

    if (this.depositError()) {
      return;
    }

    this.gs
      .addDeposit(goal.id, this.createDepositForm.value as Partial<Deposit>)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.refresh.update((v) => v + 1);
          this.showModal.set(true);
          this.showModalMessage.set('Deposit added!');
          this.createDepositForm.reset();
        },
        error: (e) => {
          console.log(e);
        },
      });
  }

  navigateToDashboard() {
    this.rs.routeToPage('/dashboard');
  }

  viewCreateGoal(e: any) {
    this.showCreateGoal.set(e);
  }

  viewEditGoal(e: boolean) {
    this.showEditGoal.set(e);
  }

  viewDeleteGoal(e: boolean) {
    this.showDeleteModal.set(true);
    this.showModalMessage.set(
      'This will permanently delete this goal and all its deposit history. This cannot be undone.',
    );
  }

  closeModals(e: boolean) {
    this.showModal.set(false);
    this.showCreateGoal.set(false);
    this.showEditGoal.set(false);
    this.showDeleteModal.set(false);

    if (this.goalDeleted()) {
      this.rs.routeToPage('/dashboard');
      this.goalDeleted.set(false);
    }
  }

  submitEditGoal(goal: GoalForm) {
    if (!goal) return;

    const newGoal = {
      name: goal.name,
      target: parseFloat(goal.target!) as number,
      initial_amount: this.selectedGoal()?.initial_amount ?? null,
      deadline: goal.deadline === '' ? null : this.gs.getDateString(goal.deadline as Date),
      is_featured: goal.is_featured,
    } as Goal;

    this.gs
      .editGoal(goal!.id as string, newGoal)
      .pipe(take(1))
      .subscribe({
        next: (data: Goal) => {
          this.refresh.update((v) => v + 1);
          this.showModal.set(true);
          this.showModalMessage.set('Goal successfully updated!');
        },
        error: (e) => {
          console.log(e);
        },
      });
  }

  deleteGoal() {
    if (!this.selectedGoal()?.id) {
      return;
    }

    let goalID: string = this.selectedGoal()!.id;

    this.gs
      .deleteGoal(goalID)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.goalDeleted.set(true);
          this.showModal.set(true);
          this.showModalMessage.set('Goal successfully deleted!');
        },
      });
  }
}
