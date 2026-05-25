import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Session } from '@supabase/supabase-js';

import { SupabaseService } from './supabase.service';


@Injectable({
  	providedIn: 'root',
})
export class LoginService {
  	private router = inject(Router);

	authSession = signal<Session | null>(null);

	constructor(private supabaseService: SupabaseService) {
		// 1. Check for an existing session on app startup (picks up your localStorage key card!)
		this.supabaseService.client.auth.getSession().then(({ data }) => {
			this.authSession.set(data.session);
		});

		// 2. Listen to real-time auth changes (Sign In / Sign Out events)
		this.supabaseService.client.auth.onAuthStateChange((_event, session) => {
			this.authSession.set(session);

			if (!session) {
				this.router.navigate(['/']);
			}
		});
	}

	getAdminInitials(): string | null {
		const email = this.authSession()?.user?.email;
		return email ? email[0] : null;
	}

	async signIn(email: string, password: string) {
		const { data, error } = await this.supabaseService.client.auth.signInWithPassword({
			email,
			password,
		});
		
		if (error) throw error;
		return data;
	}

	async signOut() {
		await this.supabaseService.client.auth.signOut();
	}
}
