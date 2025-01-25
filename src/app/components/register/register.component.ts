import { Component, OnInit } from '@angular/core';
import { imports } from '../../app.imports';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: imports,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  standalone: true,
})
export class RegisterComponent implements OnInit {
onSubmit() {
throw new Error('Method not implemented.');
}
  registerForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

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
}
