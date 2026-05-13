import { Component, output } from '@angular/core';

@Component({
  selector: 'app-no-goals',
  imports: [],
  templateUrl: './no-goals.component.html',
  styleUrl: './no-goals.component.css',
})
export class NoGoalsComponent {
  createGoal = output<boolean>();
}
