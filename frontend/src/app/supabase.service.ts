import { Injectable } from '@angular/core';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabaseRuntimeConfig } from './supabase.config';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  readonly configured = isSupabaseConfigured;
  readonly client: SupabaseClient | null = this.configured
    ? createClient(
      supabaseRuntimeConfig.supabaseUrl,
      supabaseRuntimeConfig.supabasePublishableKey,
      {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false
        }
      }
    )
    : null;

  requireClient(): SupabaseClient {
    if (!this.client) {
      throw new Error('Supabase non è configurato. Compila public/supabase-config.js.');
    }
    return this.client;
  }
}
