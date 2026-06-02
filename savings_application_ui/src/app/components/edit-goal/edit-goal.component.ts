import { Component, effect, inject, input, output, signal } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { DatePickerModule } from 'primeng/datepicker';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Goal, GoalForm } from '../../types';
import { CheckboxComponent } from '../shared/checkbox/checkbox.component';
import { ButtonComponent } from '../shared/button/button.component';
import { InputComponent } from '../shared/input/input.component';
import { GoalService } from '../../services/goal-service';

@Component({
  selector: 'app-edit-goal',
  imports: [
    DialogModule,
    ButtonComponent,
    InputComponent,
    DatePickerModule,
    ReactiveFormsModule,
    FormsModule,
    CheckboxComponent,
  ],
  templateUrl: './edit-goal.component.html',
  styleUrl: './edit-goal.component.css',
})
export class EditGoalComponent {
  gs = inject(GoalService);
  visible = input<boolean>(false);
  visibleChange = output<boolean>();
  emitEditGoal = output<GoalForm>();
  selectedGoal = input<Goal | null>();

  editGoalForm = new FormGroup({
    id: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    target: new FormControl('', [Validators.required]),
    deadline: new FormControl(''), // optional so no Validators.required
    is_featured: new FormControl(false),
  });

  constructor() {
    effect(() => {
      const goal = this.selectedGoal();

      if (goal) {
        this.editGoalForm.patchValue({
          id: goal.id,
          name: goal.name,
          target: goal.target as any,
          deadline: goal.deadline
            ? (this.gs.convertToLocalDate(goal.deadline as string) as any)
            : '',
          is_featured: goal.is_featured,
        });
      }
    });
  }

  closeModal() {
    this.visibleChange.emit(false);
  }

  editGoal() {
    if (this.editGoalForm.valid) {
      this.emitEditGoal.emit(this.editGoalForm.value as any);
    }
  }
}
