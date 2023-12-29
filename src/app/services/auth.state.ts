import { Injectable } from '@angular/core';
import { Auth, idToken } from '@angular/fire/auth';
import { BehaviorSubject, Observable, defer, switchMap, take } from 'rxjs';
import { IAuthInfo } from './auth.model';

// to make a cookie readable in SSR, inject the token from nguniversal module
// import { REQUEST } from '@nguniversal/express-engine/tokens';
// and make Request available in NodeJs
// import { Request } from 'express';




@Injectable({ providedIn: 'root' })
export class AuthState {
    // create an internal subject and an observable to keep track
    private stateItem: BehaviorSubject<IAuthInfo | null> = new BehaviorSubject(null);
    stateItem$: Observable<IAuthInfo | null> = this.stateItem.asObservable();

    // redirect update
    get redirectUrl(): string {
        return localStorage.getItem('redirectUrl');
    }
    set redirectUrl(value: string) {
        localStorage.setItem('redirectUrl', value);
    }

    constructor(
        private auth: Auth
    ) 
    {
        const _localuser: IAuthInfo = JSON.parse(localStorage.getItem('user'));
        if (_localuser) {
            this.stateItem.next(_localuser);
            _attn(_localuser);
        }

        // update at least once
        idToken(this.auth).pipe(
            take(1),
        ).subscribe({
            next: (token) => {
                if (token) {
                    
                    this.UpdateState({ token});
                }
            }
        });

    }

    UpdateState(item: Partial<IAuthInfo>): Observable<IAuthInfo> {
        const newItem = { ...this.stateItem.getValue(), ...item };
        this.stateItem.next(newItem);
        localStorage.setItem('user', JSON.stringify(newItem));
        _attn(this.stateItem.getValue(), 'update state');
        return this.stateItem$;
    }
    
    
    // reroute optionally
    Logout() {
        this.stateItem.next(null);
        localStorage.removeItem('user');
    }

    GetToken() {
        const _auth = this.stateItem.getValue();
        return _auth?.token || null;
    }
    RefreshToken(): Observable<any> {
        return defer(() => this.auth.currentUser.getIdToken(true)).pipe(
            switchMap(token => {
                return this.UpdateState({ token });
            })
        );
    }

    

}
