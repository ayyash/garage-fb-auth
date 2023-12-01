import { Component } from '@angular/core';
import { Auth, idToken } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AccountStatusPartialComponent } from './components/private/status.partial';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',

  standalone: true,
  imports: [CommonModule, RouterModule, AccountStatusPartialComponent],
})
export class AppComponent {
  constructor(private auth: Auth) {}
  Logout() {
    // logout and reroute
    // this.authState.Logout(true);
    // // also remove redirect
    // this.authState.redirectUrl = null;
    // // also local logout if using local server to set cookie
    // this.authService.Logout().subscribe();
  }
}
