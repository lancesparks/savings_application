import { Component, inject, signal } from '@angular/core';
import { InputComponent } from '../shared/input/input.component';
import { ButtonComponent } from '../shared/button/button.component';
import { RoutingService } from '../../services/routing-service';
import { AuthLayoutComponent } from '../auth-layout/auth-layout.component';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { LoginCredentials, TokenResponse } from '../../types';

@Component({
  selector: 'app-login',
  imports: [AuthLayoutComponent, InputComponent, ButtonComponent, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  heroQuote = { quote: `The goal isn't to be rich. It's to have enough.`, person: 'Morgan Housel' };
  private rs: RoutingService = inject(RoutingService);
  private as: AuthService = inject(AuthService);

  loginUserForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  submitted = signal(false);

  navigateToPage(e: boolean | MouseEvent, page: string) {
    this.rs.routeToPage(page);
  }

  login() {
    this.submitted.set(true);

    if (this.loginUserForm.valid) {
      this.as.login(this.loginUserForm.value as LoginCredentials).subscribe({
        next: (res: TokenResponse) => {
          this.as.setToken(res.access_token as string);
          this.rs.routeToPage('/dashboard');
        },
        error: (e) => {},
      });
    }
  }
}
