export interface Excursion {
  id: string;
  title: string;
  date: string;
  dateEnd?: string;
  days?: number | null;
  category: string;
  link: string;
  organizer: string;
  organizerRegion?: string;
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
  classification?: ExcursionClassification;
}

export type ExcursionClassificationDecision = 'trekking' | 'non_trekking' | 'da_verificare';

export interface ExcursionClassification {
  decision: ExcursionClassificationDecision;
  category: string;
  confidence: number | null;
  probability: number | null;
  rationale: string;
  evidenceOriginal: string;
  fingerprint: string;
  method: 'rules-v1' | 'mercury-decide';
  modelRequested: string | null;
  responseModel: string | null;
  modelAttested: boolean;
  policyVersion: string;
  modelVersion: string | null;
  mapEligible: boolean;
}
