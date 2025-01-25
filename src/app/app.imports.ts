import { RouterModule } from "@angular/router";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RegisterComponent } from "./components/register/register.component";
import { BrowserModule } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";

export const imports = [
  RouterModule,
  NavbarComponent,
  HttpClientModule,
  ReactiveFormsModule,
  FormsModule,
  RegisterComponent,
  ReactiveFormsModule,
  FormsModule,
  CommonModule
];