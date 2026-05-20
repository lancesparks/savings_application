import { CommonModule } from '@angular/common';
import { Component, effect, input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-checkbox',
  imports: [CheckboxModule, ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.css',
})
export class CheckboxComponent {
  isChecked = input<boolean>(false);
  checkboxLabel = input<string | null>(null);
  checkboxID = input<string | number>();
  checked: boolean = false;
  control = input<FormControl>();

  constructor() {
    effect(() => {
      this.checked = this.isChecked() ?? false;
    });
  }
}
