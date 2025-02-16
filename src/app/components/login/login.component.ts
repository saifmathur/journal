import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { primengmodules } from '../../primeng.imports';
import { moduleImports } from '../../app.module.imports';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { MessageService } from 'primeng/api';
import {
  SocialLoginModule,
  SocialAuthServiceConfig,
  SocialAuthService,
  SocialUser,
} from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';
declare var google: any;
@Component({
  selector: 'app-login',
  imports: [...primengmodules, ...moduleImports, SocialLoginModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [
    AuthService,
    // {
    //   provide: 'SocialAuthServiceConfig',
    //   useValue: {
    //     autoLogin: false,
    //     providers: [
    //       {
    //         id: GoogleLoginProvider.PROVIDER_ID,
    //         provider: new GoogleLoginProvider('YOUR_GOOGLE_CLIENT_ID'),
    //       },
    //     ],
    //   } as SocialAuthServiceConfig,
    // },
  ],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private authServiceGoogle: SocialAuthService
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
    if (typeof google !== 'undefined' && google.accounts) {
      this.renderGoogleSignInButton();
    } else {
      // Wait until the script is loaded
      this.loadGoogleScript().then(() => {
        this.renderGoogleSignInButton();
      });
    }
  }
  loadGoogleScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject('Google API script failed to load');
      document.head.appendChild(script);
    });
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

  onGoogleSignIn(event: any) {
    // alert('Coming soon!');
    this.authServiceGoogle
      .signIn(GoogleLoginProvider.PROVIDER_ID)
      .then((user: SocialUser) => {
        console.log(user);
        // Send the Google user token to your backend for validation
        this.loginWithGoogle(user.idToken);
      });
  }
  loginWithGoogle(idToken: string): void {
    // Send idToken to your backend for validation and generate JWT
    console.log(idToken);
    this.authService.googleLogin(idToken).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userInitials', response.initials);
        localStorage.setItem('fullName', response.fullName);
        this.showToast(
          'success',
          response.message,
          'Welcome, ' + response.fullName + '!'
        );
        this.router.navigate(['/entries']);
      },
      error: (err) => {
        console.error('Login failed:', err);
        this.showToast('error', 'Login Failed!', 'Invalid credentials');
      },
    });
  }
  onLogin() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('userInitials', response.initials);
          localStorage.setItem('fullName', response.fullName);
          this.showToast(
            'success',
            response.message,
            'Welcome, ' + response.fullName + '!'
          );
          this.router.navigate(['/entries']);
        },
        error: (err) => {
          console.error('Login failed:', err);
          this.showToast('error', 'Login Failed!', 'Invalid credentials');
        },
      });
    }
  }
  handleCredentialResponse(response: any): void {
    console.log(response);

    const idToken = response.credential;
    console.log('Google Token:', idToken);
    // Send the Google user token to your backend for validation
    this.loginWithGoogle(idToken);
  }
  renderGoogleSignInButton(): void {
    if (typeof google !== 'undefined' && google.accounts) {
      google.accounts.id.initialize({
        client_id: '755025461022-71ektdco9qu31sqi1r8mrgv7jv77a41a.apps.googleusercontent.com',
        callback: this.handleCredentialResponse.bind(this),
      });

      google.accounts.id.renderButton(
        document.getElementById('google-signin-btn')!, // Target element
        { theme: 'outline', size: 'large' } // Customize button appearance
      );
    } else {
      console.error('Google API not loaded');
    }
  }
}
