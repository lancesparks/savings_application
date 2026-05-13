import { Component, input } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
})
export class ButtonComponent {
  buttonText = input<string>();
  variant = input<'primary' | 'secondary'>('primary');
  icon = input<string>();
}
