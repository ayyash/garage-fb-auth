import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountStatusPartialComponent } from '../private/status.partial';

@Component({
  template: `
      <div class="page"><div class="container">
      <h4 class="f4">Projects</h4>
      Nothing special,  
      <cr-account-status></cr-account-status>
      <br  >
      <button class="btn-rev" (click)="callHttp()">Test HTTP call</button>
      </div></div>
    `,
  standalone: true,
  imports: [CommonModule, AccountStatusPartialComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectListComponent implements OnInit {
  constructor(private http: HttpClient,  private router: Router) {
    //
  }
  ngOnInit(): void {}

  callHttp() {
    // call http with anything to test http interceptor
    this.http.get('/projects/list').subscribe({
      next: (result) => console.log(result),
      error: (err) => {
        console.log(err);
        this.router.navigateByUrl('/public/login');
      },
    });
  }
}
