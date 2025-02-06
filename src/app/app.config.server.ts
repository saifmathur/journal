import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import Material from '@primeng/themes/material';
import Aura from '@primeng/themes/aura';
import Lara from '@primeng/themes/lara';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';
import { appConfig } from './components/app.config';

const serverConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Lara,
        options: {
          darkModeSelector: '.my-app-dark',
        },
      },
    }),
    //provideServerRendering(),
    //provideServerRoutesConfig([]),
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
