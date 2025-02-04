import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { compImports } from '../../app.component.imports';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { moduleImports } from '../../app.module.imports';
import { primengmodules } from '../../primeng.imports';
import { Router } from '@angular/router';
import { icon } from '@fortawesome/fontawesome-svg-core';
import { MessageService } from 'primeng/api';

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
  stats: any;
  closeCallback($event: MouseEvent) {}
  showNavOptions: boolean = false;
  isLoggedIn: boolean = false;
  items: any = [];
  checked: any;
  initials: any;
  sideOptions: any;
  constructor(
    private dataService: DataService,
    public authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.checkUserState();
    
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }
  getJournalStats() {
    this.dataService.getJournaStats().subscribe((res) => {
      this.stats = res;
    },(err:any)=>{

    },()=>{
    this.sideOptions = true;

    });
  }
  checkUserState() {
    setInterval(() => {
      this.checkUserLoggedIn();
    }, 1000);
  }

  logout() {
    this.authService.logout();
    this.checkUserLoggedIn();
    this.sideOptions = false;
    this.showToast('info', `You've been logged out.`);
  }

  showToast(
    severity: any = 'info',
    summary: any = '',
    detail: any = '',
    timeout: any = 4000
  ) {
    this.messageService.add({
      severity: severity,
      summary: summary,
      detail: detail,
      key: 'tl',
    });
    setTimeout(() => {
      this.messageService.clear();
    }, timeout);
  }

  getUserInitials() {}

  checkUserLoggedIn() {
    this.authService.isLoggedIn$.subscribe(
      (status) => {
        this.initials = localStorage.getItem('userInitials');
        this.fullName = localStorage.getItem('fullName');
        this.isLoggedIn = status;
        // console.log(this.isLoggedIn,status);
        this.loadMenu();
      },
      (err: any) => {},
      () => {
        this.loadMenu();
      }
    );
  }

  toggleDarkMode() {
    const element = document.querySelector('html');
    element?.classList.toggle('my-app-dark');
  }

  async openSettings() {
    this.getJournalStats();

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
