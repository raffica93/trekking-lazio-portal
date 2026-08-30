import { Injectable } from '@angular/core';
import type { User } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class AdminAuthService {
  constructor(private readonly supabase: SupabaseService) {}

  get configured(): boolean {
    return this.supabase.configured;
  }

  async signIn(email: string, password: string): Promise<void> {
    const client = this.supabase.requireClient();
    const { error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw error;

    if (!await this.currentAdmin()) {
      await client.auth.signOut();
      throw new Error('Questo account non è abilitato al pannello amministratore.');
    }
  }

  async signOut(): Promise<void> {
    if (this.supabase.client) {
      const { error } = await this.supabase.client.auth.signOut();
      if (error) throw error;
    }
  }

  async currentAdmin(): Promise<User | null> {
    if (!this.supabase.client) return null;

    const { data, error } = await this.supabase.client.auth.getUser();
    if (error || !data.user) return null;

    const { data: profile, error: profileError } = await this.supabase.client
      .from('profiles')
      .select('is_admin')
      .eq('id', data.user.id)
      .maybeSingle();

    if (profileError || !profile?.is_admin) return null;
    return data.user;
  }
}
