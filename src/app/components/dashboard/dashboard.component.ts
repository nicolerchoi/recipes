import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Recipe, RECIPE_TAG } from '../../models';
import { LoginService, RecipeService } from '../../services';


@Component({
	selector: 'app-dashboard',
	standalone: true,
	imports: [CommonModule, RouterLink],
	templateUrl: './dashboard.component.html',
	styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
	loginService = inject(LoginService);
	private recipeService = inject(RecipeService);

	recipes: Signal<Recipe[]> = this.recipeService.recipes;
	isLoading: Signal<boolean> = this.recipeService.loadingRecipes;

	filteredRecipes = computed<Recipe[]>(() => {
		const recipes = this.recipes();
		const selected = this.selectedTag();

		return this.selectedTag() === RECIPE_TAG.ALL
			? recipes
			: recipes.filter(r => r.tags.includes(selected));
	});

	readonly availableTags: { id: RECIPE_TAG, label: string }[] = [
		{ id: RECIPE_TAG.ALL, label: 'All Recipes ✨' },
		{ id: RECIPE_TAG.VEGETARIAN, label: '🥦 Vegetarian' },
		{ id: RECIPE_TAG.SOUP, label: 'Soup' },
		{ id: RECIPE_TAG.QUICK, label: '⚡ Quick' },
		{ id: RECIPE_TAG.STEAMED, label: 'Steamed' }
	];
	selectedTag = signal<RECIPE_TAG>(RECIPE_TAG.ALL);

	recipePluralMapping: { [k: string]: string } = {
		'=0': '0 Recipes',
		'=1': '1 Recipe',
		'other': '# Recipes'
	};

	ngOnInit(): void {
		this.recipeService.getRecipeSummaries();
	}

	selectTag(tag: RECIPE_TAG): void {
		this.selectedTag.set(tag);
	}
}
