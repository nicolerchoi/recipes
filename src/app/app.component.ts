import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { LoginService } from './services';
import { UpperCasePipe } from '@angular/common';


@Component({
    selector: 'app-root',
    imports: [RouterOutlet, RouterLink, UpperCasePipe],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class App {
    loginService = inject(LoginService);

    logout() {
        if (confirm('Are you sure you want to sign out of the admin panel?')) {
            this.loginService.signOut();
        }
    }
}
