import { Component, input, output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-delete-modal',
  imports: [DialogModule],
  templateUrl: './delete-modal.component.html',
  styleUrl: './delete-modal.component.css',
})
export class DeleteModalComponent {
  title = input<string>('');
  showModal = input<boolean>(false);
  emitDelete = output<boolean>();
  showModalChange = output<boolean>();

  closeModal() {
    this.showModalChange.emit(false);
  }

  deleteGoal() {
    this.emitDelete.emit(true);
  }
}
