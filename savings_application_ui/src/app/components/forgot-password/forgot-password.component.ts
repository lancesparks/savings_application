import { Component, inject } from '@angular/core';
import { InputComponent } from '../shared/input/input.component';
import { ButtonComponent } from '../shared/button/button.component';
import { RoutingService } from '../../services/routing-service';
import { AuthLayoutComponent } from '../auth-layout/auth-layout.component';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  imports: [AuthLayoutComponent, InputComponent, ButtonComponent, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  heroQuote = {
    quote: `A budget is telling your money where to go instead of wondering where it went.`,
    person: 'Dave Ramsey',
  };
  private rs: RoutingService = inject(RoutingService);

  forgotPasswordForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  navigateToPage() {
    this.rs.routeToPage('/');
  }

  onSubmit() {}
}
