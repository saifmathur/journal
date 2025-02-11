import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { primengmodules } from '../../primeng.imports';
import { moduleImports } from '../../app.module.imports';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
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
    private router: Router,
    private messageService: MessageService
  ) {
    this.initForm();
  }

  initForm() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(5)]],
    });
  }
  ngOnInit(): void {
    
  }

  showToast(severity:any='info',summary:any="",detail:any="",timeout:any=4000) {
    this.messageService.add({
      severity: severity,
      summary: summary,
      detail: detail,
      key: "tl"
    });
    setTimeout(() => {
      this.messageService.clear() 
    }, timeout);
  }

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
          this.showToast('success', response.message,'Welcome, '+response.fullName+"!")
          this.router.navigate(['/entries']);
        },
        error: (err) => {
          console.error('Login failed:', err);
          this.showToast(
            'error',
            'Login Failed!',
            'Invalid credentials',
          );
        },
      });
    }
  }
}
