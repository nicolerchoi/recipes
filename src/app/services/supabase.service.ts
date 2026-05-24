import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SupabaseService {
    private supabase: SupabaseClient;

    constructor() {
		// Initializes the secure connection client using your credentials
		this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    }

    /**
     * Universal getter to access the Supabase client anywhere in the app
     */
    get client(): SupabaseClient {
      	return this.supabase;
    }
}