import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { compImports } from '../../app.component.imports';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { moduleImports } from '../../app.module.imports';
import { primengmodules } from '../../primeng.imports';
import { Router } from '@angular/router';
import { icon } from '@fortawesome/fontawesome-svg-core';
import { MessageService } from 'primeng/api';
import { firstValueFrom } from 'rxjs';
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
  logoSrc: string | undefined;
  userDetails: any;
  userName: any;
  firstName: any;
  lastName: any;
  address1: any;
  address2: any;
  email: any;
  showPasswordChange: boolean = false;
  closeCallback($event: MouseEvent) {}
  showNavOptions: boolean = false;
  isLoggedIn: boolean = false;
  items: any = [];
  checked: any;
  initials: any;
  sideOptions: any;
  reminders: any;
  constructor(
    private dataService: DataService,
    public authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.checkUserState();
    this.setLogo();
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }
  updateUser() {
    let payload = {
      addressLine1: this.address1,
      addressLine2: this.address2,
      firstName: this.firstName,
      lastName: this.lastName,
      DOB: this.dob,
      email: this.email,
    };
    this.dataService.updateUser(payload).subscribe((res: any) => {
      this.showToast('info', res.message);
    });
  }
  async getActiveReminders() {
    const res = await firstValueFrom(this.dataService.getActiveReminders());
    this.reminders = res;
  }

  async getJournalStats() {
    const res = await firstValueFrom(this.dataService.getJournaStats());
    this.stats = res;
  }
  async getUserDetails() {
    const res = await firstValueFrom(this.dataService.getUserDetails());
    this.userDetails = res;
    this.userName = this.userDetails.userName;
    this.email = this.userDetails.userDetails.email;
    this.firstName = this.userDetails.userDetails.firstName;
    this.lastName = this.userDetails.userDetails.lastName;
    this.address1 = this.userDetails.userDetails.addressLine1;
    this.address2 = this.userDetails.userDetails.addressLine2;
    this.dob = new Date(this.userDetails.userDetails.dob);
    this.showPasswordChange = !this.userDetails.roles.includes('GOOGLE')
    console.log(this.userDetails);
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
    this.setLogo();
  }

  async openSettings() {
    await this.getJournalStats();
    await this.getActiveReminders();
    this.sideOptions = true;
  }

  async openAccountDrawers() {
    await this.getUserDetails();
    this.accountDrawer = true;
  }

  accountDrawer: boolean = false;
  dob: any;
  setLogo(): void {
    const isDarkMode =
      document.documentElement.classList.contains('my-app-dark');
    this.logoSrc = isDarkMode ? 'assets/dark.png' : 'assets/4.png';
  }

  loadMenu() {
    this.items = [
      // {
      //   label: 'Home',
      //   icon: 'pi pi-home',
      //   visible: this.authService.isLoggedIn() ? true : false,
      //   command: () => {
      //     this.router.navigate(['/entries']);
      //   },
      // },
      {
        label: 'Entries',
        icon: 'pi pi-book',
        visible: this.authService.isLoggedIn() ? true : false,
        command: () => {
          this.router.navigate(['/entries']);
        },
      },
      {
        label: 'Reminders',
        icon: 'pi pi-bell',
        disabled: false,
        visible: this.authService.isLoggedIn() ? true : false,
        command: () => {
          this.router.navigate(['/reminders']);
        },
      },
      {
        label: 'Productivity Tools',
        icon: 'pi pi-wrench',
        visible: this.authService.isLoggedIn() ? true : false,

        items: [
          {
            label: 'Resume Analyser',
            icon: 'pi pi-chart-bar',
            command: () => {
              this.router.navigate(['/analyzer']);
            },
          },
        ],
      },
    ];
  }
}
