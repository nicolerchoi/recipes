import { Component, computed, inject, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { form, FormField } from '@angular/forms/signals';
import { Router } from '@angular/router';

import { BaseRecipe, UNIT } from '../../models';
import { IngredientGroupRequest, RecipeService } from '../../services';


interface RecipeFormGroup {
    title: FormControl<string>;
    servings_base: FormControl<number>;
    image_url: FormControl<string>;
    instructions: FormControl<string>;
}

interface IngredientGroupFormGroup {
    name: FormControl<string>;
    ingredients: FormArray<FormGroup<IngredientFormGroup>>;
}

interface IngredientFormGroup {
    name: FormControl<string>;
    description: FormControl<string>;
    base_quantity: FormControl<number>;
    unit: FormControl<UNIT>;
}

@Component({
  selector: 'app-create-recipe',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, FormField],
  templateUrl: './create-recipe.component.html'
})
export class CreateRecipeComponent {
    private recipeService = inject(RecipeService);
    private router = inject(Router);

    // Expose enums to the HTML template layout
    UNIT_OPTIONS = Object.values(UNIT);

    recipeForm: FormGroup<RecipeFormGroup> = new FormGroup<RecipeFormGroup>({
        title: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
        servings_base: new FormControl<number>(1, { nonNullable: true, validators: [Validators.required] }),
        image_url: new FormControl<string>('', { nonNullable: true }),
        instructions: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] })
    });

    displayedTags = computed<string[]>(() => [...new Set([
        ...this.recipeService.tags(),
        ...this.selectedTags()
    ])]);
    selectedTags = signal<string[]>([]);
    customTag = signal<string>('');
    customTagForm = form(this.customTag);

    ingredientsForm: FormArray<FormGroup<IngredientGroupFormGroup>> = new FormArray<FormGroup<IngredientGroupFormGroup>>([
        createIngredientGroupControl()
    ]);

    isSubmitting = signal(false);

    constructor() {
		this.recipeService.getRecipeSummaries();
    }

    toggleTag(tag: string): void {
        this.selectedTags.update(c => c.includes(tag) ? c.filter(t => t !== tag) : [...c, tag]);
    }

    onEnterCustomTag(): void {
        const custom = this.customTag();
        if (custom){
            this.selectedTags.update(c => c.includes(custom) ? c : [...c, custom.toLowerCase()]);
        }
        this.customTag.set('');
    }

    addGroup() {
        this.ingredientsForm.push(createIngredientGroupControl());
    }

    removeGroup(groupIndex: number) {
        this.ingredientsForm.removeAt(groupIndex);
    }

    addIngredient(groupIndex: number) {
        this.ingredientsForm.controls[groupIndex]?.controls.ingredients.push(createIngredientControl());

    }

    removeIngredient(groupIndex: number, ingredientIndex: number) {
        this.ingredientsForm.controls[groupIndex]?.controls.ingredients.removeAt(ingredientIndex);
    }

    async onSubmit() {
        console.log(this.selectedTags())
        if (this.recipeForm.valid && this.ingredientsForm.valid) {
            const formValue = this.recipeForm.getRawValue();

            this.isSubmitting.set(true);
            const recipeData: BaseRecipe = {
                ...formValue,
                instructions: formValue.instructions
                    .split('\n')
                    .map(s => s.trim())
                    .filter(s => s.length > 0),
                tags: this.selectedTags()
            };

            const targetId = await this.recipeService.createRecipe(
                recipeData,
                this.ingredientsForm.getRawValue() as IngredientGroupRequest[]
            );

            if (targetId) {
                this.router.navigate(['/recipe', targetId]);
            } else {
                alert('Something went wrong saving to Supabase.');
                this.isSubmitting.set(false);
            }
        }
    }
}

function createIngredientControl(): FormGroup<IngredientFormGroup> {
    return new FormGroup<IngredientFormGroup>({
        name: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
        description: new FormControl<string>('', { nonNullable: true }),
        base_quantity: new FormControl<number>(1, { nonNullable: true }),
        unit: new FormControl<UNIT>(UNIT.GRAM, { nonNullable: true, validators: [Validators.required] }),
    })
}

function createIngredientGroupControl(): FormGroup<IngredientGroupFormGroup> {
    return new FormGroup<IngredientGroupFormGroup>({
        name: new FormControl<string>('Ingredients', { nonNullable: true, validators: [Validators.required] }),
        ingredients: new FormArray<FormGroup<IngredientFormGroup>>([
            createIngredientControl()
        ])
    });
}
