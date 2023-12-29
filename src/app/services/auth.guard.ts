import { inject } from '@angular/core';

import {
    ActivatedRouteSnapshot,
    CanActivateFn,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthState } from './auth.state';


export const AuthCanActivate: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> => {
    const auth = inject(AuthState);
    const router = inject(Router);

    // get data from route, for example {date: {role: 'admin'}}
    const role = route.data.role;

    // watch user
    return auth.stateItem$.pipe(
        // switch map to get claims
        // switchMap(_user => _user ? _user.getIdTokenResult() : of(null)),
        map(_user => {
            // if user exists let them in, else redirect to login
            if (!_user) {
                router.navigateByUrl('/public/login');
                return false;
            }
            // user exists, match attribute to route data
            if (!_user.hasOwnProperty(role)) {
                router.navigateByUrl('/public/login');
                return false;
            }
            return true;
        })
    );
};

