import { Component, input, model, output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
})
export class InputComponent {
  label = input<string>('');
  placeHolder = input<string | null>(null);
  control = input<FormControl>();
  numericOnly = input<boolean>(false);
  submitted = input<boolean>(false);
  showPassword = signal(false);
  emitForgotPassword = output<boolean>();

  forgotPassword() {
    this.emitForgotPassword.emit(true);
  }

  togglePassword() {
    this.showPassword.update((v) => !v);
  }

  onKeyDown(event: KeyboardEvent) {
    if (!this.numericOnly()) return;

    const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (allowed.includes(event.key)) return;

    if (isNaN(Number(event.key)) && event.key !== '.') {
      event.preventDefault();
      return;
    }

    const currentValue: string = this.control()?.value ?? '';

    if (event.key === '.' && currentValue.includes('.')) {
      event.preventDefault();
      return;
    }

    const decimalIndex = currentValue.indexOf('.');
    if (decimalIndex !== -1 && currentValue.length - decimalIndex > 2) {
      event.preventDefault();
    }
  }
}
