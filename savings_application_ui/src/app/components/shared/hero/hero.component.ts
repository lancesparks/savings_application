import { Component, input } from '@angular/core';

@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
})
export class HeroComponent {
  heroQuote = input<{ quote: string; person: string }>({ quote: '', person: '' });
}
