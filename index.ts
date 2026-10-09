export type PlaceCategory = 
  | 'attraction' 
  | 'restaurant' 
  | 'hotel' 
  | 'heritage' 
  | 'budget' 
  | 'shopping' 
  | 'activity';

export interface AccessibilityFeatures {
  wheelchairAccessible: boolean;
  stepFreeAccess: boolean;
  brailleOrAudioGuide: boolean;
  accessibleRestroom: boolean;
  notes: string;
}

export interface Place {
  id: string;
  cityId?: string;
  name: string;
  category: PlaceCategory;
  categoryLabel: string;
  tagline: string;
  description: string;
  priceLevel: '$' | '$$' | '$$$' | '$$$$';
  estimatedCostUSD: number;
  estimatedCostINR?: number;
  rating: number; // Stored demo rating
  reviewCount: number;
  neighborhood: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  accessibility: AccessibilityFeatures;
  cleanlinessScore: number; // 1-10 DEMO metric
  affordabilityScore: number; // 1-10 DEMO metric
  safetyScore?: number; // 1-10 DEMO metric
  safetyGuidanceNotes: string; // Factual guidance without guaranteed safety claims
  operatingHours: string;
  imageUrl: string;
  tags: string[];
  isDemo: boolean;
  historicalEra?: string;
  culturalSignificance?: string;
}

export type SafetySeverity = 'info' | 'caution' | 'warning';

export type ReportCategory = 
  | 'Road damage' 
  | 'Traffic issue' 
  | 'Cleanliness' 
  | 'Safety concern' 
  | 'Accessibility issue' 
  | 'Other civic issue'
  | 'Road Hazard'
  | 'Dim Lighting'
  | 'Heavy Congestion'
  | 'Sidewalk Obstruction'
  | 'General Advisory';

export interface CitizenSafetyReport {
  id: string;
  cityId?: string;
  title: string;
  category: ReportCategory;
  description: string;
  neighborhood: string;
  location?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  severity: SafetySeverity;
  timestamp: string;
  verifiedStatus: 'Community Reported (DEMO)' | 'Under Review (DEMO)' | 'Verified Advisory (DEMO)';
  hasPhoto?: boolean;
  photoUrl?: string;
  hasVoiceNote?: boolean;
  upvotes: number;
  isDemo: boolean;
}

export type AIMode = 'general' | 'planner' | 'safety' | 'foodie' | 'heritage';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  suggestedPlaces?: string[]; // IDs of recommended places
  isDemoResponse: boolean;
  mode?: AIMode;
  metadata?: {
    confidence?: number;
    processingTimeMs?: number;
    tokensUsed?: number;
    recommendedIds?: string[];
  };
}

export interface CityMetricInsight {
  weatherSummary: string;
  temperatureC: number;
  humidityPercent?: number;
  airQualityIndex: number; // AQI
  airQualityLabel: string;
  trafficStatus: string;
  cleanlinessScore: number;
  roadConditions: string;
  accessibilityIndex: string;
  activeReportsCount: number;
  lastUpdated: string;
  isDemo: boolean;
}

export interface CityConfig {
  id: string;
  name: string;
  state: string;
  country: string;
  center: { lat: number; lng: number };
  zoom: number;
  tagline: string;
  metrics: CityMetricInsight;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'Explorer' | 'Resident' | 'City Guide' | 'Civic Volunteer' | 'Verified Resident';
  avatar: string;
  contributionsCount: number;
}
