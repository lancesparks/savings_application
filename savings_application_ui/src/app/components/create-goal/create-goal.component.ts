import { Component, input, output, signal } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonComponent } from '../shared/button/button.component';
import { InputComponent } from '../shared/input/input.component';
import { DatePickerModule } from 'primeng/datepicker';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { GoalForm } from '../../types';

@Component({
  selector: 'app-create-goal',
  imports: [
    DialogModule,
    ButtonComponent,
    InputComponent,
    DatePickerModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './create-goal.component.html',
  styleUrl: './create-goal.component.css',
})
export class CreateGoalComponent {
  visible = input<boolean>(false);
  visibleChange = output<boolean>();
  emitCreateGoal = output<GoalForm>();

  createGoalForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    target: new FormControl('', [Validators.required]),
    initial_amount: new FormControl(null),
    deadline: new FormControl(''), // optional so no Validators.required
  });

  closeModal() {
    this.visibleChange.emit(false);
  }

  createNewGoal() {
    if (this.createGoalForm.valid) {
      this.emitCreateGoal.emit(this.createGoalForm.value as any);
    }
  }
}
