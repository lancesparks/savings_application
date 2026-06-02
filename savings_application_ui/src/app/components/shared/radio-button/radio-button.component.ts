import { NgClass } from '@angular/common';

import { Component, effect, input, output } from '@angular/core';

@Component({
  selector: 'app-radio-button',
  imports: [NgClass],
  templateUrl: './radio-button.component.html',
  styleUrl: './radio-button.component.css',
})
export class RadioButtonComponent {
  currentValue = input<string>('');
  options = input<{ label: string; value: string }>({ label: '', value: '' });
  emitChecked = output<string>();

  handleChecked(e: any) {
    this.emitChecked.emit(this.options().value);
  }
}
