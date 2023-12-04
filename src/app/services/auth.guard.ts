import { inject } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';

import {
    ActivatedRouteSnapshot,
    CanActivateFn,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';


export const AuthCanActivate: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> => {
    const auth = inject(Auth);
    const router = inject(Router);

    // get data from route, for example {date: {role: 'admin'}}
    const role = route.data.role;

    // watch user
    return user(auth).pipe(
        // switch map to get claims
        switchMap(_user => _user ? _user.getIdTokenResult() : of(null)),
        map(_user => {
            _attn(_user, 'here');
            // if user exists let them in, else redirect to login
            if (!_user) {
                router.navigateByUrl('/public/login');
                return false;
            }
            // user exists, match claims to route data? here we 
            if (!_user.claims.hasOwnProperty(role)) {
                router.navigateByUrl('/public/login');
                return false;
            }
            return true;
        })
    );
};

