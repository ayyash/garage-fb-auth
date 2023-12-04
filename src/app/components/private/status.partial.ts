import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { map, Observable, switchMap, filter } from 'rxjs';
import { Auth, user } from '@angular/fire/auth';

@Component({
  selector: 'cr-account-status',
  template: `
  <div class="box" *ngIf="status$ | async as s;else notloggedin">
    {{ s.email }} {{ s.bloodType }}
  </div>
  <ng-template #notloggedin>You're not logged in</ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class AccountStatusPartialComponent implements OnInit {
  status$: Observable<any>;

  // use firebase status
  constructor(private auth: Auth) {}
  ngOnInit(): void {
    // solution I: keep it foriegn, use authState or user()
    this.status$ = user(this.auth).pipe(
      filter((user) => !!user),
      switchMap((user) => (<any>user).getIdTokenResult()),
      map((token) => (<any>token).claims)
    );
  }
}
