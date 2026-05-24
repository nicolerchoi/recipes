import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';


@Component({
    selector: 'app-root',
    imports: [RouterOutlet, DashboardComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class App {
    protected readonly title = signal('recipe-app');
}
