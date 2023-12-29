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

    constructor(private authService: AuthService, private router: Router, private cdr: ChangeDetectorRef) { }
    ngOnInit() { 
    }

    login() {
        const id = Math.floor(Math.random() * 100);
        // mimic new users
        this.authService
            .Login(`user${id}@email.com`, 'Password^098')
            .pipe(
                catchError((error) => {
                    return throwError(() => error);
                })
            )
            .subscribe({
                next: (user) => {
                    if (user.isNewUser) {
                        this.showMe = true;
                        this.cdr.detectChanges();
                    } else {
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
                    if (user.isNewUser) {
                        this.showMe = true;
                        this.cdr.detectChanges();
                    } else {
                        this.router.navigateByUrl('/private/dashboard');
                    }
                },
            });
    }
    // finish sign up by google
    update() {
        this.authService.UpdateUser({ bloodType: 'B+' }).subscribe({
            next: (user) => {
                this.router.navigateByUrl('/private/dashboard');
            },
        });
    }
}
