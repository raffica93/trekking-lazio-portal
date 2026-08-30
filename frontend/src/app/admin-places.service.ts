import { Injectable } from '@angular/core';
import { type PlaceRow, type PlaceSummary, type PlaceWrite } from './place.model';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class AdminPlacesService {
  constructor(private readonly supabase: SupabaseService) {}

  async list(): Promise<PlaceSummary[]> {
    const { data, error } = await this.supabase.requireClient()
      .from('places')
      .select('id, title, location, date, status, updated_at')
      .order('date', { ascending: true });

    if (error) throw error;
    return data as PlaceSummary[];
  }

  async get(id: string): Promise<PlaceRow> {
    const { data, error } = await this.supabase.requireClient()
      .from('places')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as PlaceRow;
  }

  async create(place: PlaceWrite): Promise<PlaceRow> {
    const { data, error } = await this.supabase.requireClient()
      .from('places')
      .insert(place)
      .select('*')
      .single();

    if (error) throw error;
    return data as PlaceRow;
  }

  async update(id: string, place: PlaceWrite): Promise<PlaceRow> {
    const { data, error } = await this.supabase.requireClient()
      .from('places')
      .update(place)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    return data as PlaceRow;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase.requireClient()
      .from('places')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async uploadCover(file: File): Promise<string> {
    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const safeExtension = ['jpg', 'jpeg', 'png', 'webp'].includes(extension) ? extension : 'jpg';
    const path = `admin/${crypto.randomUUID()}.${safeExtension}`;
    const { error } = await this.supabase.requireClient()
      .storage
      .from('place-images')
      .upload(path, file, { cacheControl: '3600', upsert: false });

    if (error) throw error;
    return path;
  }

  async deleteCover(path: string): Promise<void> {
    const { error } = await this.supabase.requireClient().storage.from('place-images').remove([path]);
    if (error) throw error;
  }

  imageUrl(path: string | null): string | null {
    if (!path) return null;
    const { data } = this.supabase.requireClient().storage.from('place-images').getPublicUrl(path);
    return data.publicUrl;
  }
}
