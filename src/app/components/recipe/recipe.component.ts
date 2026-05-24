import { ChangeDetectorRef, Component, computed, effect, inject, input, signal, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TitleCasePipe } from '@angular/common';

import { Recipe } from '../../models';
import { RecipeService, ShoppingListService } from '../../services';


@Component({
	selector: 'app-recipe.component',
	standalone: true,
	imports: [RouterLink, TitleCasePipe],
	templateUrl: './recipe.component.html',
	styleUrl: './recipe.component.scss',
})
export class RecipeComponent {
	private recipeService = inject(RecipeService);
	private shoppingListService = inject(ShoppingListService)

	id = input.required<number>();

	recipe: Signal<Recipe | null> = this.recipeService.currentRecipe;
	isLoading: Signal<boolean> = this.recipeService.loadingCurrentRecipe;

	currentTab = signal<TAB>(TAB.INGREDIENTS);
	multiplier = signal<number>(1);

	tabs = computed<{ id: TAB, label: string }[]>(() => {
		const groups = this.recipe()?.ingredient_groups;
		const ingredientsCount = groups
			? groups.reduce((a, g) => a + g.ingredients.length, 0)
			: 0;

		return [
			{ id: TAB.INGREDIENTS, label: `🛒 Ingredients (${ingredientsCount})` },
			{ id: TAB.STEPS, label: '📝 Cooking Steps' }
		]
	});

	TAB = TAB;

	constructor(private cd: ChangeDetectorRef) {
		effect(() => {
			const _id = this.id();
			if (_id) {
				this.recipeService.getRecipeById(_id);
			}
		});
	}

	setTab(tab: TAB) {
		this.currentTab.set(tab);
	}

	adjustServings(amount: number) {
		const newScale = Math.max(0.25, this.multiplier() + amount);
		this.multiplier.set(newScale);
	}

	updateMultiplier(event: Event, multiplierInput: HTMLInputElement) {
		const inputElement = event.target as HTMLInputElement;
		const parsedValue = parseFloat(inputElement.value);

		// Fallback to 1 if the input is cleared, empty, or typed below 0.25
		if (isNaN(parsedValue) || parsedValue < 0.25) {
			this.multiplier.set(0.25);
		} else {
			this.multiplier.set(parsedValue);
		}

		multiplierInput.value = this.multiplier().toString();
	}

	addIngredientToShoppingList(name: string, baseQuantity: number, unit?: string) {
		const recipe = this.recipe();
		if (recipe) {
			const scaledAmount = baseQuantity * this.multiplier();
			this.shoppingListService.addIngredient(name, `${scaledAmount}${unit}`, recipe.title);
		}
	}
}

enum TAB {
	INGREDIENTS,
	STEPS
}
