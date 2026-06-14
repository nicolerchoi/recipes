import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Recipe } from '../../models';
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
	
	readonly allRecipesTag = 'All Recipes ✨';

	filteredRecipes = computed<Recipe[]>(() => {
		const recipes = this.recipes();
		const selected = this.selectedTag();

		return this.selectedTag() === this.allRecipesTag
			? recipes
			: recipes.filter(r => r.tags.includes(selected));
	});

	availableTags = computed<string[]>(() => {
		return [
			this.allRecipesTag,
			...this.recipeService.tags()
		];
	});
	selectedTag = signal<string>(this.allRecipesTag);

	recipePluralMapping: { [k: string]: string } = {
		'=0': '0 Recipes',
		'=1': '1 Recipe',
		'other': '# Recipes'
	};

	ngOnInit(): void {
		this.recipeService.getRecipeSummaries();
	}

	selectTag(tag: string): void {
		this.selectedTag.set(tag);
	}
}
