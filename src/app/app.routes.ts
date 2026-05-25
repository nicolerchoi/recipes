import { Routes } from '@angular/router';


export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
    },
    { 
        path: 'login', 
        loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) 
    },
    {
        path: 'recipe/:id',
        loadComponent: () => import('./components/recipe/recipe.component').then(m => m.RecipeComponent)
    },
    { 
        path: 'create',
        loadComponent: () => import('./components/create-recipe/create-recipe.component').then(m => m.CreateRecipeComponent) 
    },
    {
        path: '**',
        redirectTo: ''
    }
];
