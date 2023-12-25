import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  templateUrl: './login.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class PublicLoginComponent implements OnInit {
  showMe = false; // mimic a sign up field

  constructor(private authService: AuthService,
    private cdr: ChangeDetectorRef, 
    private router: Router) {}
  ngOnInit() {}

  login() {
    this.authService
      .Login('admin@email.com', 'adAd!123')
      .pipe(
        // it's better to pipe catchError
        catchError((error) => {
          console.log(error);
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (result) => {
          // redirect to dashbaord
          this.router.navigateByUrl('/private/dashboard');
        },
      });
  }

  // example register with email
  signUp() {
    const rnd = Math.floor(Math.random() * 1000);

    this.authService
      .Signup(`user${ rnd }@email.com`, 'adAd!123', { bloodType: 'B+' })
      .pipe(
        catchError((error) => {
          console.log(error);
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (user) => {
          if (user) {
            this.router.navigateByUrl('/private/dashboard');
          }
        },
      });
  }
  // example login with google, notice that we need to figure out the new user
  loginGoogle() {
    this.authService
      .LoginGoogle()
      .pipe(
        catchError((error) => {
          console.log(error);
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (user) => {
          if (!user) {
            this.router.navigateByUrl('/private/dashboard');
          } else {
            // show the sign up field
            this.showMe = true;
            this.cdr.detectChanges();
          }
        },
      });
  }
  // finish sign up by google
  updaetGoogle() {
    this.authService.UpdateUser({ bloodType: 'B+' }).subscribe({
      next: (user) => {
        this.router.navigateByUrl('/private/dashboard');
      },
    });
  }
}
