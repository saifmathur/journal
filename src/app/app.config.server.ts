import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import Material from '@primeng/themes/material';
import Aura from '@primeng/themes/aura';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';
import { appConfig } from './components/app.config';

const serverConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
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
