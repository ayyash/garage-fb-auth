import { Injectable } from '@angular/core';
import { Auth, idToken } from '@angular/fire/auth';
import { BehaviorSubject, Observable, defer, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthState {
    // create an internal subject and an observable to keep track
    private token: BehaviorSubject<string> = new BehaviorSubject(null);
    token$: Observable<string> = this.token.asObservable();


    stateItem$: Observable<any>;

    constructor(private auth: Auth) {
        // set the stateItem to that of idToken
        idToken(this.auth)
        .subscribe({
          next: (token) => {
            _attn(token, 'authstate');
            this.UpdateState(token);
          },
        });

    
    }

    GetToken() {
        return this.token.getValue();
    }

    UpdateState(token: string) {
        this.token.next(token);
    }

    Logout() {
        this.token.next(null);
    }

    RefreshToken(): Observable<any> {
        return defer(() => this.auth.currentUser.getIdToken(true)).pipe(
            tap((token) => {
                this.UpdateState(token);
            })
        );


    }
}
