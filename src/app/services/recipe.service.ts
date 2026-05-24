import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Recipe } from '../models/recipe.model';

@Injectable({
    providedIn: 'root'
})
export class RecipeService {
    constructor(private supabaseService: SupabaseService) {}

    /**
     * Fetches only the essential info needed to display recipe summary cards on the dashboard
     */
    async getRecipeSummaries(): Promise<Recipe[]> {
        const { data, error } = await this.supabaseService.client
            .from('recipes')
            .select('id, title, servings_base, image_url, tags, created_at')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching recipe summaries:', error.message);
            throw error;
        }

        return (data as unknown as Recipe[]) || [];
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