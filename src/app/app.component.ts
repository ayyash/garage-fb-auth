import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AccountStatusPartialComponent } from './components/private/status.partial';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',

  standalone: true,
  imports: [CommonModule, RouterModule, AccountStatusPartialComponent],
})
export class AppComponent {
  constructor(private router: Router, private authService: AuthService) {
  }
  Logout() {
    this.authService.Signout().subscribe({
      next: (res) => {
        if (res) {
          this.router.navigateByUrl('/public/login');
        }
      }
    })
  }
}
