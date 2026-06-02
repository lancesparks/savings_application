import { CurrencyPipe } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-info-card',
  imports: [CurrencyPipe],
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
  displayMoney = input<boolean>(false);
  detailsPage = input(false);
}
