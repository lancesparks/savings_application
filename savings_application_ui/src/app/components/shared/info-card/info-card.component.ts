import { Component, input } from '@angular/core';

@Component({
  selector: 'app-info-card',
  imports: [],
  templateUrl: './info-card.component.html',
  styleUrl: './info-card.component.css',
  host: {
    '[class.md:col-span-2]': 'featured()',
  },
})
export class InfoCardComponent {
  title = input<string>('');
  cardData = input<string>('');
  completed = input<boolean>(false);
  featured = input<boolean>(true);
}
