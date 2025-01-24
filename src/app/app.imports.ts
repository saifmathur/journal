import { RouterModule } from "@angular/router";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

export const imports = [
  RouterModule,
  NavbarComponent,
  HttpClientModule,
  ReactiveFormsModule,
  FormsModule
];