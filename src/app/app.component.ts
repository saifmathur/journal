import { Component, OnInit } from '@angular/core';
import { compImports } from './app.component.imports';
import { moduleImports } from './app.module.imports';
import { primengmodules } from './primeng.imports';
import { LoaderService } from './services/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [...compImports, ...moduleImports, ...primengmodules],
  // providers: [
  //   {
  //     provide: HTTP_INTERCEPTORS,
  //     useClass: AuthInterceptor,
  //     multi: true, // Ensure multiple interceptors can be used
  //   },
  //   DataService
  // ],
})
export class AppComponent implements OnInit {
  constructor(private loaderService: LoaderService) {
    this.isLoading = this.loaderService.isLoading.asObservable();
  }

  isLoading: any;

  ngOnInit(): void {}
  // AppComponent logic here
}
