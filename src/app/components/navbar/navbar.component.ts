import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { compImports } from '../../app.component.imports';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { moduleImports } from '../../app.module.imports';
import { primengmodules } from '../../primeng.imports';
import { Router } from '@angular/router';
import { icon } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  standalone: true,
  imports: [...compImports, ...moduleImports, ...primengmodules],
  providers: [AuthService, DataService],
})
export class NavbarComponent implements OnChanges, OnInit {
  fullName: any;
closeCallback($event: MouseEvent) {
}
  showNavOptions: boolean = false;
  isLoggedIn: boolean = false;
  items: any = [];
  checked: any;
  initials: any;
  sideOptions: any;
  constructor(
    private dataService: DataService,
    public authService: AuthService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.checkUserState()
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    
  }

  checkUserState(){
    setInterval(() => {
      this.checkUserLoggedIn()
    }, 1000);
  }
  
  logout() {
    this.authService.logout();
    this.checkUserLoggedIn();
    this.sideOptions = false
  }
  getUserInitials() {}
  
  checkUserLoggedIn() {
    this.authService.isLoggedIn$.subscribe((status) => {
      
      this.initials = localStorage.getItem('userInitials');
      this.fullName = localStorage.getItem('fullName');
      this.isLoggedIn = status;
      // console.log(this.isLoggedIn,status);
      this.loadMenu();
    },(err:any)=>{

    },()=>{
      this.loadMenu()
    });
  }

  
  toggleDarkMode() {
    const element = document.querySelector('html');
    element?.classList.toggle('my-app-dark');
  }

  openSettings() {
    this.sideOptions = true
  }

  
  loadMenu() {
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        visible: this.authService.isLoggedIn() ? true : false,
        command: () => {
          this.router.navigate(['/create']);
        },
      },
      {
        label: 'Entries',
        icon: 'pi pi-envelope',
        visible: this.authService.isLoggedIn() ? true : false,
        command: () => {
          this.router.navigate(['/entries']);
        },
      },
    ];
  }
}
