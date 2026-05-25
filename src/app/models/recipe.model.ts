export interface BaseRecipe {
    title: string;
    servings_base: number;
    image_url: string | null;
    instructions: string[];
    tags: string[];
}

export interface Recipe extends BaseRecipe {
    id: number;
    created_at: string;
    // Optional: We can nest these when fetching deep relational data
    ingredient_groups?: IngredientGroup[];
}

export interface IngredientGroup {
    id: number;
    recipe_id: number;
    name: string;
    ingredients: Ingredient[];
}

export interface Ingredient {
    id: number;
    group_id: number;
    name: string;
    description?: string;
    base_quantity: number;
    unit: string;
}
