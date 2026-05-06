import { Component } from '@angular/core';
import { InputComponent } from '../shared/input/input.component';
import { ButtonComponent } from '../shared/button/button.component';

@Component({
  selector: 'app-login',
  imports: [InputComponent, ButtonComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {}
