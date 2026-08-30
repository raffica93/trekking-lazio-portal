export interface Excursion {
  id: string;
  title: string;
  date: string;
  dateEnd?: string;
  days?: number | null;
  category: string;
  link: string;
  organizer: string;
  location: string;
  lat?: number | null;
  lng?: number | null;
  cost: string;
  costAmount?: number | null;
  time: string;
  distanceKm?: number | null;
  elevationM?: number | null;
  durationHours?: number | null;
  mountainGroup?: string;
  region?: string;
  transport?: string;
  privateCar?: boolean | null;
  startPlace?: string;
  coordinatesQuality?: string;
  summary?: string;
  activityType?: string;
  terrain?: string;
  difficultyNote?: string;
}
