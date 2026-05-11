import { Component, input, output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  imports: [ReactiveFormsModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
})
export class InputComponent {
  label = input<string>('');
  control = input<FormControl>();
  emitForgotPassword = output<boolean>();
  showPassword = signal(false);
  submitted = input<boolean>(false);

  forgotPassword() {
    this.emitForgotPassword.emit(true);
  }

  togglePassword() {
    this.showPassword.update((v) => !v);
  }
}
