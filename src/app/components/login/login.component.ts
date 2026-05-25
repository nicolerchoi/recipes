import { Location } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { LoginService } from '../../services';


@Component({
	selector: 'app-login.component',
	standalone: true,
	imports: [ReactiveFormsModule],
	templateUrl: './login.component.html',
	styleUrl: './login.component.scss',
})
export class LoginComponent {
	private recipeService = inject(LoginService);
  	private location = inject(Location);
  
  	errorMessage = signal('');

	loginForm = new FormGroup({
		email: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
		password: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] })
	});

	async handleLogin() {
		try {
			this.errorMessage.set('');
			const { email, password } = this.loginForm.getRawValue();
			
			await this.recipeService.signIn(email, password);
			this.location.back();
		} catch (err: any) {
			this.errorMessage.set(err.message || 'Invalid email or password.');
		}
	}
}
