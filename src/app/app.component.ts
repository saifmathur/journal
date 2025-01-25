import { Component } from '@angular/core';
import { imports } from './app.imports';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: imports,
  providers: [HttpClientModule],
})
export class AppComponent {
  // AppComponent logic here
}
