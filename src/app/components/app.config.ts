import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import Material from '@primeng/themes/material';
import { provideRouter } from '@angular/router';
import { routes } from '../app.routes';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from '../interceptors/auth.interceptor';
import { LoaderInterceptor } from '../interceptors/loader.interceptor';
import Lara from '@primeng/themes/lara';
import { MessageService } from 'primeng/api';
import {
  GoogleLoginProvider,
  SocialAuthServiceConfig,
} from '@abacritt/angularx-social-login';
export const appConfig: ApplicationConfig = {
  providers: [
    MessageService,
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Lara,
        options: {
          darkModeSelector: '.my-app-dark',
        },
      },
    }),
    importProvidersFrom(HttpClientModule),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true, // Allow multiple interceptors
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true, // Allow multiple interceptors
    },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '755025461022-71ektdco9qu31sqi1r8mrgv7jv77a41a.apps.googleusercontent.com'
            ),
          },
        ],
      } as SocialAuthServiceConfig,
    },
    provideRouter(routes), // Provide the router configuration
  ],
};
