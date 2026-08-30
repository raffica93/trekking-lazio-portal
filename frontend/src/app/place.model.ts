import { Excursion } from './excursion.model';

export type PlaceStatus = 'draft' | 'published';

export interface PlaceRow {
  id: string;
  source_id: string | null;
  slug: string;
  title: string;
  date: string;
  date_end: string | null;
  days: number | null;
  category: string;
  external_url: string;
  organizer: string;
  location: string;
  municipality: string | null;
  province: string | null;
  region: string | null;
  latitude: number;
  longitude: number;
  cost: string | null;
  cost_amount: number | null;
  time: string | null;
  distance_km: number | null;
  elevation_m: number | null;
  duration_hours: number | null;
  mountain_group: string | null;
  transport: string | null;
  private_car: boolean | null;
  start_place: string | null;
  coordinates_quality: string | null;
  summary: string | null;
  activity_type: string | null;
  terrain: string | null;
  difficulty_note: string | null;
  cover_image_path: string | null;
  status: PlaceStatus;
  created_at: string;
  updated_at: string;
}

export interface PlaceSummary {
  id: string;
  title: string;
  location: string;
  date: string;
  status: PlaceStatus;
  updated_at: string;
}

export type PlaceWrite = Omit<
  PlaceRow,
  'id' | 'created_at' | 'updated_at' | 'source_id' | 'cost_amount' | 'private_car'
> & {
  date_end: string | null;
  days: number | null;
  cost_amount: number | null;
  distance_km: number | null;
  elevation_m: number | null;
  duration_hours: number | null;
  private_car: boolean | null;
};

export function placeToExcursion(place: PlaceRow): Excursion {
  return {
    id: place.id,
    title: place.title,
    date: place.date,
    dateEnd: place.date_end ?? undefined,
    days: place.days,
    category: place.category,
    link: place.external_url,
    organizer: place.organizer,
    location: place.location,
    lat: place.latitude,
    lng: place.longitude,
    cost: place.cost ?? 'Vedi sito',
    costAmount: place.cost_amount,
    time: place.time ?? '',
    distanceKm: place.distance_km,
    elevationM: place.elevation_m,
    durationHours: place.duration_hours,
    mountainGroup: place.mountain_group ?? undefined,
    region: place.region ?? undefined,
    transport: place.transport ?? undefined,
    privateCar: place.private_car,
    startPlace: place.start_place ?? undefined,
    coordinatesQuality: place.coordinates_quality ?? undefined,
    summary: place.summary ?? undefined,
    activityType: place.activity_type ?? undefined,
    terrain: place.terrain ?? undefined,
    difficultyNote: place.difficulty_note ?? undefined
  };
}
