import { Routes } from '@angular/router';
import { CreationPageComponent } from './components/creation-page/creation-page.component';
import { ViewJournalPageComponent } from './components/view-journal-page/view-journal-page.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Default route
  { path: 'create', component: CreationPageComponent },
  { path: 'entries', component: ViewJournalPageComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
];
