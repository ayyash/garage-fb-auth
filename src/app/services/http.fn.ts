// FYI info, not using in this app, and better not use it, it fails the async
// pipe in SSR

import {
    HttpErrorResponse,
    HttpHandlerFn,
    HttpInterceptorFn,
    HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, Subject, catchError, filter, finalize, switchMap, throwError } from 'rxjs';
import { AuthState } from './auth.state';

const getHeaders = (authState: AuthState): any => {
  //  authorization here
  let headers: any = {};
  const _auth = authState.GetToken();
  if (_auth && _auth !== '') {
    headers['authorization'] = `Bearer ${_auth}`;
  }

  return headers;
};


let isBusy = false;
let recall: Subject<boolean> = new Subject();

const  handle401Error = (originalReq: HttpRequest<any>, next: HttpHandlerFn, authState: AuthState): Observable<any> => {
    _attn('handle401Error');

    if (!isBusy) {
        isBusy = true;
        // progress subject to false
        recall.next(false);
        return authState.RefreshToken().pipe(
          switchMap((result: any) => {
            if (result) {
              // progress subject to true
              recall.next(true);
  
              // token saved (in RefreshToken), now recall the original req after adjustment
              return next(
                originalReq.clone({ setHeaders: getHeaders(authState) })
              );
            }
          }),
          catchError((error) => {
            // else refresh token did not work, its bigger than both of us
            // log out and throw error
            authState.Logout();
            return throwError(() => error);
          }),
          finalize(() => {
            isBusy = false;
          })
        );
      } else {
        // return the subject, watch when it's ready, switch to recall original request
        return recall.pipe(
          filter((ready) => ready === true),
          switchMap((ready) => {
            // try again with adjusted header
  
            return next(
              originalReq.clone({ setHeaders: getHeaders(authState) })
            );
          })
        );
      }
};

export const AppInterceptorFn: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  // prefixing the api with proper value, mostly from config
  // remote config url are expected to filtered out, it would not make sense
  const url = 'http://localhost:10000/api' + req.url;
  const authState = inject(AuthState);

  const adjustedReq = req.clone({
    url: url,
    setHeaders: getHeaders(authState),
  });

  

  return next(adjustedReq).pipe(
    catchError((error) => {
        // if this is really an http error
        if (
          error instanceof HttpErrorResponse &&
          // and of 401 status
          error.status === 401 
          // filter out login calls
        //   req.url.indexOf('login') < 0
        ) {
          return handle401Error(adjustedReq, next, authState);
        }
        // rethrow error
        return throwError(() => error);
      })
  );
};
