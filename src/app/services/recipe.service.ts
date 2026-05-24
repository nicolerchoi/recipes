import { Injectable, signal } from '@angular/core';

import { Recipe } from '../models';

import { SupabaseService } from './supabase.service';


@Injectable({
    providedIn: 'root'
})
export class RecipeService {
    recipes = signal<Recipe[]>([]);
    loadingRecipes = signal<boolean>(false);

    currentRecipe = signal<Recipe | null>(null);
    loadingCurrentRecipe = signal<boolean>(false);

    constructor(private supabaseService: SupabaseService) {}

    /**
     * Fetches only the essential info needed to display recipe summary cards on the dashboard
     */
    async getRecipeSummaries(): Promise<void> {
        this.loadingRecipes.set(true);

        const { data, error } = await this.supabaseService.client
            .from('recipes')
            .select('id, title, servings_base, image_url, tags, created_at')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching recipe summaries:', error.message);
            throw error;
        }

        if (data) {
            this.recipes.set(data as Recipe[]);
        }
        this.loadingRecipes.set(false);
    }

    async getRecipeById(id: number): Promise<void> {
        this.loadingCurrentRecipe.set(true);

        const { data, error } = await this.supabaseService.client
            .from('recipes')
            .select(`
                *,
                ingredient_groups (
                    id,
                    name,
                    ingredients (
                        id,
                        name,
                        description,
                        base_quantity,
                        unit
                    )
                )
            `)
            .eq('id', id)
            .single(); // only expect one specific record row
        
        if (!error && data) {
            this.currentRecipe.set(data)
        } else {
            this.currentRecipe.set(null)
        }

        this.loadingCurrentRecipe.set(false)
    }

    /**
     * Fetches all recipes, complete with nested ingredient groups and ingredients!
     */
    async getAllRecipes(): Promise<Recipe[]> {
        const { data, error } = await this.supabaseService.client
            .from('recipes')
            .select(`
                id,
                title,
                servings_base,
                image_url,
                instructions,
                created_at,
                ingredient_groups (
                    id,
                    recipe_id,
                    name,
                    ingredients (
                        id,
                        group_id,
                        name,
                        base_quantity,
                        unit
                    )
                )
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching recipes:', error.message);
            throw error;
        }

        return (data as unknown as Recipe[]) || [];
    }
}
