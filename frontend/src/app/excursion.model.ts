export interface Excursion {
  id: string;
  title: string;
  date: string;
  category: string;
  link: string;
  organizer: string;
  location: string;
  lat: number;
  lng: number;
  cost: string;
  time: string;
  distanceKm?: number | null;
  elevationM?: number | null;
  durationHours?: number | null;
  mountainGroup?: string;
  region?: string;
  startPlace?: string;
  coordinatesQuality?: string;
  summary?: string;
  activityType?: string;
  terrain?: string;
  difficultyNote?: string;
}
