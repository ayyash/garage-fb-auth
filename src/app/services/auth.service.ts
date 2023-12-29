import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    Auth,
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut
} from '@angular/fire/auth';

import { Observable, catchError, defer, map, switchMap, throwError } from 'rxjs';

import { IAuthInfo, MapAuth } from './auth.model';
import { AuthState } from './auth.state';

@Injectable({ providedIn: 'root' })
export class AuthService {
    constructor(
        private http: HttpClient,
        private authState: AuthState,
        private auth: Auth
    ) { }

    

    Login(email: string, password: string): Observable<IAuthInfo> {
        const res = () => signInWithEmailAndPassword(this.auth, email, password);
        return defer(res).pipe(
            switchMap(auth => auth.user.getIdToken()),
            switchMap(token => this.LoginUser(token, email)),
            catchError(err => {
                if (err.code === 'auth/invalid-credential') {
                    return this.SingUp(email, password);
                }
                // do something local with the error
                return throwError(() => err);
            })

        );
    }

    LoginGoogle(): Observable<IAuthInfo> {
        const provider = new GoogleAuthProvider();
        provider.addScope('email');
        const res = () => signInWithPopup(this.auth, provider);

        return defer(res).pipe(
            switchMap(auth => auth.user.getIdToken()),
            switchMap(token => this.LoginUser(token, this.auth.currentUser.providerData[0].email))
        );
    }


    SingUp(email: string, password: string): Observable<IAuthInfo> {
        // here send a sign up request, with extra params
        const res = () =>
            createUserWithEmailAndPassword(this.auth, email, password);

        // after creating the user, we need to send it back to our API to create custom claims
        return defer(res).pipe(
            // first IdToken
            switchMap(auth => auth.user.getIdToken()),
            switchMap(token => this.LoginUser(token, email))
        );
    }


    LoginUser(token: string, email?: any): Observable<IAuthInfo> {
        return this.http.post('/auth/login', { token, email }).pipe(
            map((auth: any) => {
                // map and save user in localstorage here
                const _user = MapAuth(auth);
                this.authState.UpdateState({ ..._user, token });
                return _user;
            }),
        );  
    }


    UpdateUser(custom: any): Observable<IAuthInfo> {
        return this.http.patch('/user', custom).pipe(
            map(auth => {
                // now update localstorage again, without touching the token
                const _user = MapAuth(auth);
                this.authState.UpdateState({..._user});
                return _user;
            })
        );
    }

    Signout(): Observable<boolean> {
        const res = () => signOut(this.auth).then(() => {
            this.authState.Logout();
            return true;
        });

        return defer(res);
    }
}
