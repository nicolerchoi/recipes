export interface Recipe {
    id: number;
    title: string;
    servings_base: number;
    image_url: string | null;
    instructions: string[];
    created_at: string;
    // Optional: We can nest these when fetching deep relational data
    ingredient_groups?: IngredientGroup[];
}

export interface IngredientGroup {
    id: number;
    recipe_id: number;
    name: string;
    // Optional: Nesting the actual ingredients inside their respective section
    ingredients?: Ingredient[];
}

export interface Ingredient {
    id: number;
    group_id: number;
    name: string;
    base_quantity: number;
    unit: string;
}
