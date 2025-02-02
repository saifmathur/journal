import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { primengmodules } from '../../primeng.imports';
import { moduleImports } from '../../app.module.imports';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-login',
  // imports: [ FormsModule, ReactiveFormsModule, CardModule, InputTextModule,ButtonModule,PasswordModule,CommonModule],
  imports: [...primengmodules, ...moduleImports],

  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [AuthService],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.initForm();
  }

  initForm() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(5)]],
    });
  }
  ngOnInit(): void {}

  onGoogleSignIn() {
    alert('Coming soon!');
  }
  onLogin() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('userInitials', response.initials);
          localStorage.setItem('fullName', response.fullName);
          this.router.navigate(['/create']);
        },
        error: (err) => {
          console.error('Login failed:', err);
          alert('Invalid credentials');
        },
      });
    }
  }
}
