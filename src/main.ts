import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
    APP_INITIALIZER,
    EnvironmentProviders,
    importProvidersFrom,
} from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { browserPopupRedirectResolver, browserSessionPersistence, initializeAuth, provideAuth } from '@angular/fire/auth';
import { bootstrapApplication } from '@angular/platform-browser';
import { Routes, provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { PublicLoginComponent } from './app/components/public/login.component';
import { AuthCanActivate } from './app/services/auth.guard';
import { AuthState } from './app/services/auth.state';
import { AppInterceptorFn } from './app/services/http.fn';

const AppRoutes: Routes = [
    {
        path: 'public/login',
        component: PublicLoginComponent,
    },
    {
        path: 'projects',
        loadChildren: () =>
            import('./app/routes/project.route').then((m) => m.ProjectRoutes),
    },
    {
        path: 'private',
        loadChildren: () =>
            import('./app/routes/dashboard.route').then((m) => m.DashboardRoutes),
        canActivate: [AuthCanActivate],
        data: { role: 'admin' }
    },
];

// add a provider to array of providers
const CoreProviders = [
    provideHttpClient(withInterceptors([AppInterceptorFn])),
    {
        provide: APP_INITIALIZER,
        // dummy factory
        useFactory: () => () => { },
        multi: true,
        // injected depdencies, this will be constructed immidiately
        deps: [AuthState],
    },
];

const AppRouteProviders = [provideRouter(AppRoutes)];
const fbApp = () =>
    initializeApp({
        apiKey: 'AIzaSyCHBiAIxrs5sFa3tmryQ11sG9P192_AwsI',
        authDomain: 'abajor-web.firebaseapp.com',
        projectId: 'abajor-web',
        storageBucket: 'abajor-web.appspot.com',
        messagingSenderId: '69179931415',
        appId: '1:69179931415:web:e077653eee2689c1b8d552',
    });
const authApp = () => initializeAuth(fbApp(), {
    persistence: browserSessionPersistence,
    popupRedirectResolver: browserPopupRedirectResolver
});

const firebaseProviders: EnvironmentProviders = importProvidersFrom([
    provideFirebaseApp(fbApp),
    provideAuth(authApp),
]);

bootstrapApplication(AppComponent, {
    providers: [
        firebaseProviders,
        // provide few things
        ...CoreProviders,
        ...AppRouteProviders,
    ],
});
