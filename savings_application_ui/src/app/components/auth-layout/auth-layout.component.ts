import { Component, input } from '@angular/core';
import { HeroComponent } from '../shared/hero/hero.component';

@Component({
  selector: 'app-auth-layout',
  imports: [HeroComponent],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.css',
})
export class AuthLayoutComponent {
  heroQuote = input<{ quote: string; person: string }>({ quote: '', person: 'string' });
  pageTitle = input<string>('Welcome Back');
  pageSubTitle = input<string>('Sign in to your account');
}
