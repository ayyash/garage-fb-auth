import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    Auth,
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    getAdditionalUserInfo,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut
} from '@angular/fire/auth';

import { Observable, defer, pipe, switchMap, tap } from 'rxjs';

import { AuthState } from './auth.state';

@Injectable({ providedIn: 'root' })
export class AuthService {
    constructor(
        private http: HttpClient,
        private authState: AuthState,
        private auth: Auth
    ) { }

    private _updateState = (force: boolean) => pipe(
        switchMap(_ => this.auth.currentUser.getIdToken(force)),
        tap((token) => {
            // save state as well
            _attn(token,'update state');
            this.authState.UpdateState(token);
        })
    );

    // soliont I: keep it foreign
    Login(email: string, password: string): Observable<any> {
        const res = () => signInWithEmailAndPassword(this.auth, email, password);
        return defer(res);
    }
    LoginGoogle(): Observable<boolean> {
        const provider = new GoogleAuthProvider();
        const res = () =>
            signInWithPopup(this.auth, provider).then((userCredential) => {
                const info = getAdditionalUserInfo(userCredential);
                return info.isNewUser;
            });
        // we need the boolean, so lets delay the update 
        return defer(res);
    }

    Signup(email: string, password: string, custom: any): Observable<any> {
        // here send a sign up request, with extra params
        const res = () =>
            createUserWithEmailAndPassword(this.auth, email, password);

        // after creating the user, we need to send it back to our API to create custom claims
        return defer(res).pipe(
            // first IdToken
            this._updateState(false),
            switchMap((_) => this.UpdateUser(custom))
        );
    }

    UpdateUser(custom: any): Observable<any> {
        return this.http.post('/user', custom).pipe(
            this._updateState(true)
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
