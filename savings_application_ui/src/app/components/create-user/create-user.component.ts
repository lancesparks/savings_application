import { Component, inject, signal } from '@angular/core';
import { InputComponent } from '../shared/input/input.component';
import { ButtonComponent } from '../shared/button/button.component';
import { RoutingService } from '../../services/routing-service';
import { AuthLayoutComponent } from '../auth-layout/auth-layout.component';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { User } from '../../types';

@Component({
  selector: 'app-create-user',
  imports: [AuthLayoutComponent, InputComponent, ButtonComponent, ReactiveFormsModule],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css',
})
export class CreateUserComponent {
  private rs: RoutingService = inject(RoutingService);
  private as: AuthService = inject(AuthService);

  createUserForm = new FormGroup({
    first_name: new FormControl('', [Validators.required]),
    last_name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  heroQuote = {
    quote: `Do not save what is left after spending, but spend what is left after saving.`,
    person: 'Warren Buffet',
  };

  submitted = signal(false);

  navigateToPage() {
    this.rs.routeToPage('/');
  }

  onSubmit() {
    this.submitted.set(true);
    if (this.createUserForm.valid) {
      this.as.createUser(this.createUserForm.value as User).subscribe((data) => console.log(data));
    }
  }
}
