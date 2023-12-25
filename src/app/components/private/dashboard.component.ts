import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Auth, getIdTokenResult } from '@angular/fire/auth';

@Component({
  templateUrl: './dashboard.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountDashboardComponent implements OnInit {
  constructor(private auth: Auth) {
    //
  }
  ngOnInit(): void {
    //
  }
  readCurrentToke() {
    getIdTokenResult(this.auth.currentUser).then(token => {
        _attn(token.claims, 'claims');
    })
  }

  refreshToken() {
    getIdTokenResult(this.auth.currentUser, true).then(token => {
        _attn(token.claims, 'refreshed');
    });
  }
}
