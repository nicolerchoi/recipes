import { computed, Injectable, signal } from '@angular/core';


export interface ShoppingItem {
	id: string;
	name: string;
	amount: string;
	recipeTitle: string;
}

@Injectable({
  	providedIn: 'root',
})
export class ShoppingListService {
	private listItems = signal<ShoppingItem[]>([]);

	items = this.listItems.asReadonly();

	totalItems = computed(() => this.listItems().length);

	addIngredient(name: string, amount: string, recipeTitle: string) {
		const newItem: ShoppingItem = {
			id: Math.random().toString(36).substring(2),
			name,
			amount,
			recipeTitle
		};
		this.listItems.update(oldItems => [...oldItems, newItem]);
	}

	removeItem(id: string) {
		this.listItems.update(oldItems => oldItems.filter(item => item.id !== id));
	}
}
