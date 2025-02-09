import { Component, OnInit } from '@angular/core';
import { compImports } from '../../app.component.imports';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { moduleImports } from '../../app.module.imports';
import { primengmodules } from '../../primeng.imports';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-register',
  imports: [...moduleImports, ...primengmodules],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  standalone: true,
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  value2: any;
  dob: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password2: ['', [Validators.required, Validators.minLength(6)]],
      DOB: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      addressLine1: [''],
      addressLine2: [''],
      phone: [''], // Validates 10-digit phone numbers
      // [Validators.required, Validators.pattern('^[0-9]{10}$')]
    });
  }
  usernameTaken: boolean = false;
  checkDuplicateUserName() {
    this.authService
      .checkDuplicateUserName(this.registerForm.value.username)
      .subscribe((res: any) => {
        this.usernameTaken = res;
      });
  }

  passwordsMatch: boolean = true;
  checkPasswordMatch() {
    if (
      this.registerForm.value.password !== this.registerForm.value.password2
    ) {
      this.passwordsMatch = false;
    } else {
      this.passwordsMatch = true;
    }
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const formData = new FormData();
      Object.keys(this.registerForm.value).forEach((key) => {
        formData.append(key, this.registerForm.value[key]);
      });
      this.authService.register(formData).subscribe({
        next: (response) => {
          this.showToast('success','User Registered!');
          this.registerForm.reset();
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Registration failed:', err);
          // alert('Registration failed!');
          this.showToast('error','Registration Failed!')
        },
      });
    }
  }

  showToast(
    severity: any = 'info',
    summary: any = '',
    detail: any = '',
    timeout: any = 4000
  ) {
    this.messageService.add({
      severity: severity,
      summary: summary,
      detail: detail,
      key: 'tl',
    });
    setTimeout(() => {
      this.messageService.clear();
    }, timeout);
  }
}
