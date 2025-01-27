import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { imports } from '../../app.imports';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  standalone: true,
  imports: imports,
  providers: [AuthService, DataService],
})
export class NavbarComponent implements OnChanges, OnInit {
  showNavOptions: boolean = false;
  isLoggedIn: boolean = false;
  constructor(
    private dataService: DataService,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this.checkUserLoggedIn();
  }
  ngOnChanges(changes: SimpleChanges): void {}

  logout() {
    this.authService.logout();
    this.checkUserLoggedIn();
  }
  getUserInitials() {}

  checkUserLoggedIn() {
    this.authService.isLoggedIn$.subscribe((status) => {
      console.log(status);
      
      this.isLoggedIn = status;
    });
  }
}
