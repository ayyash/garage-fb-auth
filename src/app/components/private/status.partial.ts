import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { IAuthInfo } from '../../services/auth.model';
import { AuthState } from '../../services/auth.state';

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
  status$: Observable<IAuthInfo>;

  // use firebase status
  constructor(private authState: AuthState) {}
  ngOnInit(): void {
    this.status$ = this.authState.stateItem$;
  }
}
