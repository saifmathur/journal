import { Component, OnInit } from '@angular/core';
import { imports } from './app.imports';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: imports,
  // providers: [
  //   {
  //     provide: HTTP_INTERCEPTORS,
  //     useClass: AuthInterceptor,
  //     multi: true, // Ensure multiple interceptors can be used
  //   },
  //   DataService
  // ],
})
export class AppComponent implements OnInit{
  ngOnInit(): void {
  }
  // AppComponent logic here
}
