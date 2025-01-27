import { Component, OnInit } from '@angular/core';
import { imports } from '../../app.imports';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: imports,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  standalone: true,
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      dob: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      addressLine1: ['', [Validators.required]],
      addressLine2: ['', [Validators.required]],
      age: ['', [Validators.required, Validators.min(18)]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]], // Validates 10-digit phone numbers
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const formData = new FormData();
      Object.keys(this.registerForm.value).forEach((key) => {
        formData.append(key, this.registerForm.value[key]);
      });
      this.authService.register(formData).subscribe({
        next: (response) => {
          alert('User Registered!');
          this.registerForm.reset()
          this.router.navigate(['/login'])
        },
        error: (err) => {
          console.error('Registration failed:', err);
          alert('Registration failed!');
        },
      });
    }
  }
}
