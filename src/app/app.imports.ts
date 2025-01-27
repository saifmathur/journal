import { RouterModule } from "@angular/router";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RegisterComponent } from "./components/register/register.component";
import { BrowserModule } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";
import { LoginComponent } from "./components/login/login.component";
import { AuthInterceptor } from "./interceptors/auth.interceptor";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


export const imports = [
  RouterModule,
  NavbarComponent,
  ReactiveFormsModule,
  FormsModule,
  RegisterComponent,
  ReactiveFormsModule,
  FormsModule,
  CommonModule,
  LoginComponent,
  FontAwesomeModule

];