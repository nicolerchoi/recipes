import { Routes } from '@angular/router';


export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
    },
    {
        path: 'recipe/:id',
        loadComponent: () => import('./components/recipe/recipe.component').then(m => m.RecipeComponent)
    },
    {
        path: '**',
        redirectTo: ''
    }
];
