import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component'; // Standalone component

import { appConfig } from './app/components/app.config';

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));


