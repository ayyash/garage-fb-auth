import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AccountStatusPartialComponent } from '../private/status.partial';
import { CommonModule } from '@angular/common';

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
  constructor(private http: HttpClient) {
    //
  }
  ngOnInit(): void {}

  callHttp() {
    // call http with anything to test http interceptor
    this.http.get('/auth/login').subscribe({
      next: (result) => console.log(result),
      error: (err) => console.log(err),
    });
  }
}
