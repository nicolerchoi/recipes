import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeService } from '../../services/recipe.service';
import { Recipe } from '../../models/recipe.model';


@Component({
	selector: 'app-dashboard',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './dashboard.component.html',
	styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
	recipes: Recipe[] = [];
	filteredRecipes: Recipe[] = [];
	isLoading = true;

	// Temporary mock tags until we add them to the database!
	availableTags: string[] = ['All', 'Vegetarian', 'Soup', 'Dinner', 'Quick & Easy'];
	selectedTag: string = 'All';

	constructor(private recipeService: RecipeService) {}

	async ngOnInit() {
		try {
			// Captures the real recipes directly from your database, complete with their real tags!
			this.recipes = await this.recipeService.getRecipeSummaries();
			this.filteredRecipes = this.recipes;
		} catch (error) {
			console.error('Failed to load dashboard recipes', error);
		} finally {
			this.isLoading = false;
		}
	}

	filterByTag(tag: string) {
		this.selectedTag = tag;
		if (tag === 'All') {
			this.filteredRecipes = this.recipes;
		} else {
			// Filters the list instantly in the browser memory
			this.filteredRecipes = this.recipes.filter(recipe => recipe.tags.includes(tag));
		}
	}
}