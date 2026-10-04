import { z } from 'zod';

export const SoilTypeEnum = z.enum([
  'Alluvial',
  'Black',
  'Red',
  'Laterite',
  'Arid',
  'Saline',
  'Peaty',
]);

export const SeasonEnum = z.enum([
  'Spring',
  'Summer',
  'Monsoon',
  'Autumn',
  'Winter',
]);

export const IrrigationEnum = z.enum([
  'Rainfed',
  'Drip',
  'Sprinkler',
  'Canal',
  'Tube well',
]);

export const BudgetRangeEnum = z.enum(['Low', 'Medium', 'High']);

export const AdvisoryRequestSchema = z.object({
  region: z.string().min(2, 'Region must be at least 2 characters'),
  landSizeAcre: z
    .number()
    .positive('Land size must be a positive number')
    .max(100000, 'Land size seems unrealistically large'),
  soilType: SoilTypeEnum,
  season: SeasonEnum,
  irrigation: IrrigationEnum,
  budgetRange: BudgetRangeEnum,
  primaryGoal: z.string().max(500).optional(),
});

export type AdvisoryRequest = z.infer<typeof AdvisoryRequestSchema>;

// ------------------------------------------------------------------
// AI Response types (mirroring the Gemini schema)
// ------------------------------------------------------------------
export interface RecommendedCrop {
  cropName: string;
  expectedYieldPerAcre: string;
  reasonForRecommendation: string;
}

export interface FertilizerScheduleItem {
  phase: string;
  action: string;
}

export interface AdvisoryAIResponse {
  recommendedCrops: RecommendedCrop[];
  fertilizerSchedule: FertilizerScheduleItem[];
  riskFactors: string[];
}

// ------------------------------------------------------------------
// Advisory record as stored in Supabase
// ------------------------------------------------------------------
export interface Advisory {
  id: string;
  user_id: string;
  region: string;
  land_size_acre: number;
  soil_type: string;
  season: string;
  irrigation: string;
  budget_range: string;
  primary_goal?: string;
  ai_response: AdvisoryAIResponse;
  created_at: string;
}
