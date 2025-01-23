import { RouterModule } from "@angular/router";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { HttpClientModule } from "@angular/common/http";

export const imports = [RouterModule, NavbarComponent, HttpClientModule];