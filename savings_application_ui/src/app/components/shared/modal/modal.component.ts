import { Component, input, output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-modal',
  imports: [DialogModule, ButtonComponent],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent {
  modalMessage = input<string>('');
  showModal = input<boolean>(false);
  showModalChange = output<boolean>();

  closeModal() {
    this.showModalChange.emit(false);
  }
}
